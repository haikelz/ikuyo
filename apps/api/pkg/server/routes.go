package server

import (
	"ekel-backend/pkg/configs"
	"ekel-backend/pkg/controllers"
	"ekel-backend/pkg/server/routes"
	"ekel-backend/pkg/services"
)

func (s *FiberApp) RegisterFiberRoutes() {
	// routes.HomeRoute(s)
	// routes.SwaggerRoute(s)
	// routes.PrometheusRoute(s)

	db := configs.NewDB()

	guestbookService := services.NewGuestbookService(db)
	guestbookController := controllers.NewGuestbookController(guestbookService)

	wakatimeService := services.NewWakatimeService()
	wakatimeController := controllers.NewWakatimeController(wakatimeService)

	// routes.CreateGuestbookRoute(s, guestbookController)
	routes.GetGuestbookRoute(s, guestbookController)
	// routes.DeleteGuestbookRoute(s, guestbookController)
	// routes.UpdateGuestbookRoute(s, guestbookController)
	// routes.LoginAdminRoute(s, guestbookController)
	// routes.ValidateCookieRoute(s, guestbookController)
	// routes.GetAllUserByEmailRoute(s, guestbookController)
	// routes.DeleteUserByEmailRoute(s, guestbookController)
	routes.GetWakatimeStatsRoute(s, wakatimeController)
}
