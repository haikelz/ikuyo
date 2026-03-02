package configs

import (
	"github.com/bytedance/sonic"
	"github.com/gofiber/fiber/v2"
)

var FbrCfg = fiber.New(fiber.Config{
	ServerHeader:  "Ekel Backend",
	AppName:       "Ekel Backend",
	JSONEncoder:   sonic.Marshal,
	JSONDecoder:   sonic.Unmarshal,
	BodyLimit:     1024 * 1024 * 10,
	CaseSensitive: true,
	Prefork:       true,
	StrictRouting: true,
})
