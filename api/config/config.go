package config

import (
	"encoding/json"
	"fmt"
	"os"
)

type Config struct {
	Port     int `json:"port"`
	Database struct {
		Host     string `json:"host"`
		Port     int    `json:"port"`
		User     string `json:"user"`
		Password string `json:"password"`
		DBName   string `json:"dbname"`
	} `json:"database"`
	MediaMTX struct {
		HLSUrl string `json:"hls_url"`
		APIUrl string `json:"api_url"`
	} `json:"mediamtx"`
	JwtSecret string `json:"jwt_secret"`
}

func LoadConfig() (*Config, error) {
	file, err := os.Open("config.json")
	if err != nil {
		return nil, fmt.Errorf("could not open config file: %v", err)
	}
	defer file.Close()

	var config Config
	if err := json.NewDecoder(file).Decode(&config); err != nil {
		return nil, fmt.Errorf("could not parse config file: %v", err)
	}

	return &config, nil
}
