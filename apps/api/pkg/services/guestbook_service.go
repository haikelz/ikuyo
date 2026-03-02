package services

import (
	"ekel-backend/pkg/entities"
	"ekel-backend/pkg/models"
	"ekel-backend/pkg/utils"
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

type GuestbookService struct {
	Db *gorm.DB
}

func NewGuestbookService(db *gorm.DB) *GuestbookService {
	return &GuestbookService{
		Db: db,
	}
}

func (s *GuestbookService) CreateGuestbook(guestbook *entities.Guestbook) error {
	err := s.Db.Preload("guestbook").Create(&guestbook).Error
	if err != nil {
		return err
	}

	return nil
}

func (s *GuestbookService) GetGuestbook() ([]*entities.Guestbook, error) {
	var guestbook []*entities.Guestbook

	err := s.Db.Table("guestbook").Find(&guestbook).Error
	if err != nil {
		return nil, err
	}

	return guestbook, nil
}

func (s *GuestbookService) DeleteGuestbook(id int32) error {
	var guestbook entities.Guestbook

	err := s.Db.Preload("guestbook").Where("id = ?", id).Delete(&guestbook).Error
	if err != nil {
		return err
	}

	return nil
}

func (s *GuestbookService) UpdateGuestbook(id int32, guestbook *entities.Guestbook) error {
	err := s.Db.Preload("guestbook").Where("id = ?", id).Save(&guestbook).Error
	if err != nil {
		return err
	}

	return nil
}

func (s *GuestbookService) LoginAdmin(authRequest *models.AuthRequest) (string, error) {
	adminPassword := utils.Env().ADMIN_PASSWORD
	adminEmail := utils.Env().ADMIN_EMAIL

	if authRequest.Email != adminEmail || authRequest.Password != adminPassword {
		return "", errors.New("invalid email or password")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email":    authRequest.Email,
		"password": authRequest.Password,
	})

	return token.SignedString([]byte(utils.Env().JWT_SECRET))
}

func (s *GuestbookService) ValidateCookie(cookie string) (bool, error) {
	token, err := jwt.Parse(cookie, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fiber.ErrUnauthorized
		}
		return []byte(utils.Env().JWT_SECRET), nil
	})
	if err != nil || !token.Valid {
		return false, errors.New("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return false, errors.New("invalid token")
	}

	emailValue, ok := claims["email"].(string)
	if !ok || emailValue == "" || emailValue != utils.Env().ADMIN_EMAIL {
		return false, errors.New("missing email in token")
	}
	if emailValue != utils.Env().ADMIN_EMAIL {
		return false, errors.New("invalid email in token")
	}

	passwordValue, ok := claims["password"].(string)
	if !ok || passwordValue == "" {
		return false, errors.New("missing password in token")
	}
	if passwordValue != utils.Env().ADMIN_PASSWORD {
		return false, errors.New("invalid password in token")
	}

	return true, nil
}

func (s *GuestbookService) GetAllUserByEmail() ([]*entities.User, error) {
	var guestbook []*entities.Guestbook

	err := s.Db.Table("guestbook").Find(&guestbook).Error
	if err != nil {
		return nil, err
	}

	users := make([]*entities.User, len(guestbook))
	for i, guestbook := range guestbook {
		users[i] = &entities.User{
			Email:    "", //guestbook.Email,
			Username: guestbook.Username,
		}
	}

	return users, nil
}

func (s *GuestbookService) DeleteUserByEmail(email string) error {
	err := s.Db.Table("guestbook").Where("email = ?", email).Delete(&entities.Guestbook{}).Error
	if err != nil {
		return err
	}

	return nil
}
