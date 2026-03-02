package main

import (
	"ekel-backend/pkg/configs"
	"ekel-backend/pkg/server"

	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

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
func main() {
	configs.NewViper()

	server := server.New()
	server.RegisterFiberRoutes()

	server.Listen(":4000")
}
