package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"mime"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"
	"time"
)

const (
	staticRoot = "/srv"
	staticAddr = "0.0.0.0:8080"
	healthURL  = "http://127.0.0.1:8080/health"
)

func main() {
	if len(os.Args) > 1 && os.Args[1] == "healthcheck" {
		os.Exit(runHealthcheck())
	}

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	server := &http.Server{
		Addr:              staticAddr,
		Handler:           staticHandler{root: staticRoot},
		ReadHeaderTimeout: 5 * time.Second,
	}

	serverErr := make(chan error, 1)
	go func() {
		log.Printf("serving static files from %s on %s", staticRoot, staticAddr)
		serverErr <- server.ListenAndServe()
	}()

	select {
	case <-ctx.Done():
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := server.Shutdown(shutdownCtx); err != nil {
			log.Printf("static server shutdown failed: %v", err)
		}
	case err := <-serverErr:
		if errors.Is(err, http.ErrServerClosed) {
			return
		}
		if err != nil {
			log.Fatalf("static server failed: %v", err)
		}
	}
}

func runHealthcheck() int {
	client := http.Client{Timeout: 3 * time.Second}
	resp, err := client.Get(healthURL)
	if err != nil {
		fmt.Fprintf(os.Stderr, "healthcheck failed: %v\n", err)
		return 1
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Fprintf(os.Stderr, "healthcheck returned %d\n", resp.StatusCode)
		return 1
	}

	return 0
}

type staticHandler struct {
	root string
}

func (h staticHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if r.URL.Path == "/health" {
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok\n"))
		return
	}

	requestedPath := filepath.Clean("/" + strings.TrimPrefix(r.URL.Path, "/"))
	filePath := filepath.Join(h.root, requestedPath)

	if !strings.HasPrefix(filePath, filepath.Clean(h.root)+string(os.PathSeparator)) && filePath != filepath.Clean(h.root) {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	servedPath := filePath
	stat, err := os.Stat(servedPath)
	if err == nil && stat.IsDir() {
		servedPath = filepath.Join(servedPath, "index.html")
		stat, err = os.Stat(servedPath)
	}

	if err != nil || stat.IsDir() {
		servedPath = filepath.Join(h.root, "index.html")
		stat, err = os.Stat(servedPath)
		if err != nil || stat.IsDir() {
			http.Error(w, "index.html not found", http.StatusNotFound)
			return
		}
	}

	setContentType(w, servedPath)
	http.ServeFile(w, r, servedPath)
}

func setContentType(w http.ResponseWriter, filePath string) {
	if contentType := mime.TypeByExtension(filepath.Ext(filePath)); contentType != "" {
		w.Header().Set("Content-Type", contentType)
	}
}
