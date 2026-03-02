package configs

import "go.uber.org/zap"

func NewZap() *zap.Logger {
	logger, _ := zap.NewProduction()
	defer logger.Sync()

	return logger
}
