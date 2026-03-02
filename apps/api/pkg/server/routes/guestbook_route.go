package routes

import (
	"ekel-backend/pkg/controllers"

	"github.com/gofiber/fiber/v2"
)

/*
	func HomeRoute(api fiber.Router) {
		api.Get("/", controllers.HomeHandler)
	}

	func PrometheusRoute(api fiber.Router) {
		api.Use("/metrics", middleware.AdminAuth, adaptor.HTTPHandler(controllers.PrometheusHandler()))
	}

	func SwaggerRoute(api fiber.Router) {
		api.Use(swagger.New(configs.SwgCfg))
	}

	func CreateGuestbookRoute(api fiber.Router, guestbookController *controllers.GuestbookController) {
		api.Post("/api/v1/guestbook", middleware.AdminAuth, guestbookController.CreateGuestbookHandler)
	}

	func DeleteGuestbookRoute(api fiber.Router, guestbookController *controllers.GuestbookController) {
		api.Delete("/api/v1/guestbook/:id", middleware.AdminAuth, guestbookController.DeleteGuestbookHandler)
	}

	func UpdateGuestbookRoute(api fiber.Router, guestbookController *controllers.GuestbookController) {
		api.Put("/api/v1/guestbook/:id", middleware.AdminAuth, guestbookController.UpdateGuestbookHandler)
	}

	func LoginAdminRoute(api fiber.Router, guestbookController *controllers.GuestbookController) {
		api.Post("/api/v1/admin/login", guestbookController.LoginAdminHandler)
	}

	func ValidateCookieRoute(api fiber.Router, guestbookController *controllers.GuestbookController) {
		api.Post("/api/v1/admin/validate-cookie", guestbookController.ValidateCookieHandler)
	}

	func GetAllUserByEmailRoute(api fiber.Router, guestbookController *controllers.GuestbookController) {
		api.Get("/api/v1/admin/get-all-user-by-email", middleware.AdminAuth, guestbookController.GetAllUserByEmailHandler)
	}

	func DeleteUserByEmailRoute(api fiber.Router, guestbookController *controllers.GuestbookController) {
		api.Delete("/api/v1/admin/delete-user-by-email", middleware.AdminAuth, guestbookController.DeleteUserByEmailHandler)
	}
*/

func GetGuestbookRoute(api fiber.Router, guestbookController *controllers.GuestbookController) {
	api.Get("/api/v1/guestbook", guestbookController.GetGuestbookHandler)
}
