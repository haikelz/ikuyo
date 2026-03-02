package app

import (
	"net/http"

	"ekel-backend/pkg/server"

	"github.com/gofiber/fiber/v2/middleware/adaptor"
)

// Handle deployment to Vercel Serverless
// @title Ekel Backend
// @version 1.0
// @termsOfService http://swagger.io/terms/
// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io
// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Enter the token with the `BearerAuth` prefix."
func Handler(w http.ResponseWriter, r *http.Request) {
	r.RequestURI = r.URL.String()

	server := server.New()
	server.RegisterFiberRoutes()

	adaptor.FiberApp(server.App).ServeHTTP(w, r)
}
