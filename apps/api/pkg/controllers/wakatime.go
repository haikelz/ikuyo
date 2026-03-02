package controllers

import (
	"ekel-backend/pkg/models"
	"ekel-backend/pkg/services"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

type WakatimeController struct {
	wakatimeService *services.WakatimeService
}

func NewWakatimeController(wakatimeService *services.WakatimeService) *WakatimeController {
	return &WakatimeController{wakatimeService: wakatimeService}
}

func (wc *WakatimeController) GetWakatimeStatsHandler(c *fiber.Ctx) error {
	wakatimeStats, err := wc.wakatimeService.GetWakatimeStats()
	if err != nil {
		return c.JSON(models.APIErrorResponse{
			StatusCode: http.StatusInternalServerError,
			Message:    "Failed to get Wakatime stats",
			Stack:      err.Error(),
		})
	}

	return c.JSON(models.APISuccessGetWakatimeStatsResponse{
		StatusCode: http.StatusOK,
		Message:    "Success get Wakatime stats",
		Data:       wakatimeStats.Data,
	})
}
