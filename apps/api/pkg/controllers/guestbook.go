package controllers

import (
	"ekel-backend/pkg/entities"
	"ekel-backend/pkg/models"
	"ekel-backend/pkg/services"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

type GuestbookController struct {
	guestbookService *services.GuestbookService
}

func NewGuestbookController(guestbookService *services.GuestbookService) *GuestbookController {
	return &GuestbookController{guestbookService: guestbookService}
}

// HomeHandler godoc
// @Summary Get Home
// @Description Get Home
// @Tags Home
// @Accept json
// @Produce json
// @Success 200 {object} models.APIHomeResponse "Get Home Success"
// @Failure 400 {object} models.APIErrorResponse "Bad Request"
// @Failure 500 {object} models.APIErrorResponse "Internal Server Error"
// @Router / [get]
func HomeHandler(c *fiber.Ctx) error {
	return c.JSON(models.APIHomeResponse{
		StatusCode: http.StatusOK,
		Message:    "success get home",
	})

}

// PrometheusHandler godoc
// @Summary Get Metrics
// @Description Get Metrics
// @Tags Metrics
// @Accept json
// @Produce json
// @Failure 400 {object} models.APIErrorResponse "Bad Request"
// @Failure 500 {object} models.APIErrorResponse "Internal Server Error"
// @Router /metrics [get]
// @Security BearerAuth
// @in header
// @name Authorization
func PrometheusHandler() http.Handler {
	return promhttp.Handler()
}

// CreateGuestbookHandler godoc
// @Summary Create Guestbook
// @Description Create Guestbook
// @Tags Guestbook
// @Accept json
// @Produce json
// @Param guestbook body entities.Guestbook true "Guestbook"
// @Success 200 {object} models.APISuccessResponse "Success Create Guestbook"
// @Failure 400 {object} models.APIErrorResponse "Bad Request"
// @Failure 500 {object} models.APIErrorResponse "Internal Server Error"
// @Router /api/v1/guestbook [post]
// @Security BearerAuth
// @in header
// @name Authorization
func (gc *GuestbookController) CreateGuestbookHandler(c *fiber.Ctx) error {
	var guestbook entities.Guestbook

	err := c.BodyParser(&guestbook)
	if err != nil {
		return c.JSON(models.APIErrorResponse{
			StatusCode: http.StatusBadRequest,
			Message:    "error create guestbook",
			Stack:      err.Error(),
		})
	}

	err = gc.guestbookService.CreateGuestbook(&guestbook)
	if err != nil {
		return c.JSON(models.APIErrorResponse{
			StatusCode: http.StatusInternalServerError,
			Message:    "error create guestbook",
			Stack:      err.Error(),
		})
	}

	return c.JSON(models.APISuccessResponse{
		StatusCode: http.StatusOK,
		Message:    "success create guestbook",
	})
}

// GetGuestbookHandler godoc
// @Summary Get Guestbook
// @Description Get Guestbook
// @Tags Guestbook
// @Accept json
// @Produce json
// @Success 200 {object} models.APISuccessGetGuestbookResponse "Success Get Guestbook"
// @Failure 400 {object} models.APIErrorResponse "Bad Request"
// @Failure 500 {object} models.APIErrorResponse "Internal Server Error"
// @Router /api/v1/guestbook [get]
func (gc *GuestbookController) GetGuestbookHandler(c *fiber.Ctx) error {
	guestbooks, err := gc.guestbookService.GetGuestbook()
	if err != nil {
		return c.JSON(models.APIErrorResponse{
			StatusCode: http.StatusInternalServerError,
			Message:    "error get guestbook",
			Stack:      err.Error(),
		})
	}

	return c.JSON(models.APISuccessGetGuestbookResponse{
		StatusCode: http.StatusOK,
		Message:    "success get guestbook",
		Data:       guestbooks,
	})
}

// DeleteGuestbookHandler godoc
// @Summary Delete Guestbook
// @Description Delete Guestbook
// @Tags Guestbook
// @Accept json
// @Produce json
// @Param id path int true "ID"
// @Success 200 {object} models.APISuccessResponse "Success Delete Guestbook"
// @Failure 400 {object} models.APIErrorResponse "Bad Request"
// @Failure 500 {object} models.APIErrorResponse "Internal Server Error"
// @Router /api/v1/guestbook/{id} [delete]
// @Security BearerAuth
// @description Enter the token with the BearerAuth prefix.
// @in header
// @name Authorization
func (gc *GuestbookController) DeleteGuestbookHandler(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 32)
	if err != nil {
		return c.JSON(models.APIErrorResponse{
			StatusCode: http.StatusBadRequest,
			Message:    "error delete guestbook",
			Stack:      err.Error(),
		})
	}

	err = gc.guestbookService.DeleteGuestbook(int32(id))
	if err != nil {
		return c.JSON(models.APIErrorResponse{
			StatusCode: http.StatusInternalServerError,
			Message:    "error delete guestbook",
			Stack:      err.Error(),
		})
	}

	return c.JSON(models.APISuccessResponse{
		StatusCode: http.StatusOK,
		Message:    "success delete guestbook",
	})
}

// UpdateGuestbookHandler godoc
// @Summary Update Guestbook
// @Description Update Guestbook
// @Tags Guestbook
// @Accept json
// @Produce json
// @Param id path int true "ID"
// @Param guestbook body entities.Guestbook true "Guestbook"
// @Success 200 {object} models.APISuccessResponse "Success Update Guestbook"
// @Failure 400 {object} models.APIErrorResponse "Bad Request"
// @Failure 500 {object} models.APIErrorResponse "Internal Server Error"
// @Router /api/v1/guestbook/{id} [put]
// @Security BearerAuth
// @description Enter the token with the BearerAuth prefix.
// @in header
// @name Authorization
func (gc *GuestbookController) UpdateGuestbookHandler(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 32)
	if err != nil {
		return c.JSON(models.APIErrorResponse{
			StatusCode: http.StatusBadRequest,
			Message:    "error update guestbook",
			Stack:      err.Error(),
		})
	}

	var guestbook entities.Guestbook

	err = c.BodyParser(&guestbook)
	if err != nil {
		return c.JSON(models.APIErrorResponse{
			StatusCode: http.StatusBadRequest,
			Message:    "error update guestbook",
			Stack:      err.Error(),
		})
	}

	err = gc.guestbookService.UpdateGuestbook(int32(id), &guestbook)
	if err != nil {
		return c.JSON(models.APIErrorResponse{
			StatusCode: http.StatusInternalServerError,
			Message:    "error update guestbook",
			Stack:      err.Error(),
		})
	}

	return c.JSON(models.APISuccessResponse{
		StatusCode: http.StatusOK,
		Message:    "success update guestbook",
	})
}

// LoginAdminHandler godoc
// @Summary Login Admin
// @Description Login Admin
// @Tags Admin
// @Accept json
// @Produce json
// @Param authRequest body models.AuthRequest true "Auth Request"
// @Success 200 {object} models.AuthAPISuccessResponse "Success Login Admin"
// @Failure 400 {object} models.APIErrorResponse "Bad Request"
// @Failure 500 {object} models.APIErrorResponse "Internal Server Error"
// @Router /api/v1/admin/login [post]
func (gc *GuestbookController) LoginAdminHandler(c *fiber.Ctx) error {
	var authRequest models.AuthRequest

	err := c.BodyParser(&authRequest)
	if err != nil {
		return c.JSON(models.APIErrorResponse{
			StatusCode: http.StatusBadRequest,
			Message:    "error login admin",
			Stack:      err.Error(),
		})
	}

	authToken, err := gc.guestbookService.LoginAdmin(&authRequest)
	if err != nil {
		return c.JSON(models.APIErrorResponse{
			StatusCode: http.StatusBadRequest,
			Message:    "error login admin",
			Stack:      err.Error(),
		})
	}

	return c.JSON(models.AuthAPISuccessResponse{
		StatusCode: http.StatusOK,
		Message:    "success login admin",
		AuthToken:  authToken,
	})
}

// ValidateCookieHandler godoc
// @Summary Validate Cookie
// @Description Validate Cookie
// @Tags Admin
// @Accept json
// @Produce json
// @Success 200 {object} models.APISuccessResponse "Success Validate Cookie"
// @Failure 400 {object} models.APIErrorResponse "Bad Request"
// @Failure 500 {object} models.APIErrorResponse "Internal Server Error"
// @Router /api/v1/admin/validate-cookie [post]
// @Security BearerAuth
// @in header
// @name Authorization
func (gc *GuestbookController) ValidateCookieHandler(c *fiber.Ctx) error {
	var adminToken = c.Get("Authorization")
	adminToken = strings.Split(adminToken, " ")[1]

	cookie, err := gc.guestbookService.ValidateCookie(adminToken)
	if err != nil || !cookie {
		return c.JSON(models.APIErrorResponse{
			StatusCode: http.StatusUnauthorized,
			Message:    "invalid cookie",
			Stack:      err.Error(),
		})
	}

	return c.JSON(models.APISuccessResponse{
		StatusCode: http.StatusOK,
		Message:    "success validate cookie",
	})
}

// GetAllUserByEmailHandler godoc
// @Summary Get All User By Email
// @Description Get All User By Email
// @Tags Admin
// @Accept json
// @Produce json
// @Success 200 {object} models.APISuccessGetUserByEmailResponse "Success Get All User By Email"
// @Failure 400 {object} models.APIErrorResponse "Bad Request"
// @Failure 500 {object} models.APIErrorResponse "Internal Server Error"
// @Router /api/v1/admin/get-all-user-by-email [get]
// @Security BearerAuth
// @in header
// @name Authorization
func (gc *GuestbookController) GetAllUserByEmailHandler(c *fiber.Ctx) error {
	var adminToken = c.Get("Authorization")
	adminToken = strings.Split(adminToken, " ")[1]

	cookie, err := gc.guestbookService.ValidateCookie(adminToken)
	if err != nil || !cookie {
		return c.JSON(models.APIErrorResponse{
			StatusCode: http.StatusUnauthorized,
			Message:    "invalid cookie",
			Stack:      err.Error(),
		})
	}

	users, err := gc.guestbookService.GetAllUserByEmail()
	if err != nil {
		return c.JSON(models.APIErrorResponse{
			StatusCode: http.StatusInternalServerError,
			Message:    "error get user by email",
			Stack:      err.Error(),
		})
	}

	return c.JSON(models.APISuccessGetUserByEmailResponse{
		StatusCode: http.StatusOK,
		Message:    "success get user by email",
		Data:       users,
	})
}

// DeleteUserByEmailHandler godoc
// @Summary Delete User By Email
// @Description Delete User By Email
// @Tags Admin
// @Accept json
// @Produce json
// @Param email body models.DeleteUserByEmailRequest true "Email"
// @Success 200 {object} models.APISuccessResponse "Success Delete User By Email"
// @Failure 400 {object} models.APIErrorResponse "Bad Request"
// @Failure 500 {object} models.APIErrorResponse "Internal Server Error"
// @Router /api/v1/admin/delete-user-by-email [delete]
// @Security BearerAuth
// @in header
// @name Authorization
func (gc *GuestbookController) DeleteUserByEmailHandler(c *fiber.Ctx) error {
	var email models.DeleteUserByEmailRequest

	var adminToken = c.Get("Authorization")
	adminToken = strings.Split(adminToken, " ")[1]

	err := c.BodyParser(&email)
	if err != nil {
		return c.JSON(models.APIErrorResponse{
			StatusCode: http.StatusBadRequest,
			Message:    "error delete user by email",
			Stack:      err.Error(),
		})
	}

	cookie, err := gc.guestbookService.ValidateCookie(adminToken)
	if err != nil || !cookie {
		return c.JSON(models.APIErrorResponse{
			StatusCode: http.StatusUnauthorized,
			Message:    "invalid cookie",
			Stack:      err.Error(),
		})
	}

	fmt.Println(email.Email)

	err = gc.guestbookService.DeleteUserByEmail(email.Email)
	if err != nil {
		return c.JSON(models.APIErrorResponse{
			StatusCode: http.StatusInternalServerError,
			Message:    "error delete user by email",
			Stack:      err.Error(),
		})
	}

	return c.JSON(models.APISuccessResponse{
		StatusCode: http.StatusOK,
		Message:    "success delete user by email",
	})
}
