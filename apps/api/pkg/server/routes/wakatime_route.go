package routes

import (
	"ekel-backend/pkg/controllers"

	"github.com/gofiber/fiber/v2"
)

func GetWakatimeStatsRoute(api fiber.Router, wakatimeController *controllers.WakatimeController) {
	api.Get("/api/v1/wakatime/stats", wakatimeController.GetWakatimeStatsHandler)
}
