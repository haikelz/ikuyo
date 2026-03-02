package middleware

import (
	"net/http"
	"strings"

	"ekel-backend/pkg/models"
	"ekel-backend/pkg/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func AdminAuth(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")

	if authHeader == "" {
		return c.Status(http.StatusUnauthorized).JSON(models.APIErrorResponse{
			StatusCode: http.StatusUnauthorized,
			Message:    "missing authorization header",
			Stack:      "",
		})
	}

	parts := strings.SplitN(authHeader, " ", 2)
	if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
		return c.Status(http.StatusUnauthorized).JSON(models.APIErrorResponse{
			StatusCode: http.StatusUnauthorized,
			Message:    "invalid authorization header format",
			Stack:      "",
		})
	}

	tokenString := parts[1]

	jwtSecret := utils.Env().JWT_SECRET

	if jwtSecret == "" {
		return c.Status(http.StatusInternalServerError).JSON(models.APIErrorResponse{
			StatusCode: http.StatusInternalServerError,
			Message:    "missing JWT_SECRET configuration",
			Stack:      "",
		})
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fiber.ErrUnauthorized
		}
		return []byte(jwtSecret), nil
	})
	if err != nil || !token.Valid {
		return c.Status(http.StatusUnauthorized).JSON(models.APIErrorResponse{
			StatusCode: http.StatusUnauthorized,
			Message:    "invalid token",
			Stack:      "",
		})
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(http.StatusUnauthorized).JSON(models.APIErrorResponse{
			StatusCode: http.StatusUnauthorized,
			Message:    "invalid token claims",
			Stack:      "",
		})
	}

	emailValue, ok := claims["email"].(string)
	if !ok || emailValue == "" {
		return c.Status(http.StatusForbidden).JSON(models.APIErrorResponse{
			StatusCode: http.StatusForbidden,
			Message:    "missing email in token",
			Stack:      "",
		})
	}

	passwordValue, ok := claims["password"].(string)
	if !ok || passwordValue == "" {
		return c.Status(http.StatusForbidden).JSON(models.APIErrorResponse{
			StatusCode: http.StatusForbidden,
			Message:    "missing password in token",
			Stack:      "",
		})
	}

	adminPassword := utils.Env().ADMIN_PASSWORD
	adminEmail := utils.Env().ADMIN_EMAIL

	if adminEmail == "" || emailValue != adminEmail || passwordValue != adminPassword {
		return c.Status(http.StatusForbidden).JSON(models.APIErrorResponse{
			StatusCode: http.StatusForbidden,
			Message:    "forbidden",
			Stack:      "you are not authorized",
		})
	}

	return c.Next()
}
