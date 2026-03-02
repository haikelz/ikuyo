package configs

import (
	"ekel-backend/pkg/entities"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/tursodatabase/libsql-client-go/libsql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func NewDB() *gorm.DB {
	godotenv.Load()

	databaseUrl := os.Getenv("TURSO_DATABASE_URL")
	databaseToken := os.Getenv("TURSO_AUTH_TOKEN")

	db, err := gorm.Open(sqlite.Dialector{DriverName: "libsql", DSN: databaseUrl + "?authToken=" + databaseToken})
	if err != nil {
		log.Fatal(err)
	}

	err = db.AutoMigrate(&entities.Guestbook{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	return db
}
