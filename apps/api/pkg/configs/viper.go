package configs

import (
	"strings"

	"github.com/fsnotify/fsnotify"
	"github.com/spf13/viper"
	"go.uber.org/zap"
)

func NewViper() *viper.Viper {
	viper.SetConfigType(".env")
	viper.AddConfigPath(".")
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	viper.AutomaticEnv()

	viper.WatchConfig()
	logger := NewZap()

	viper.OnConfigChange(func(e fsnotify.Event) {
		logger.Info("Config file changed:", zap.String("file", e.Name))
	})

	return viper.GetViper()
}
