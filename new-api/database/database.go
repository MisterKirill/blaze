package database

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/MisterKirill/blaze/api/config"
	_ "github.com/lib/pq"
)

func InitDatabase(cfg *config.Config) (*sql.DB, error) {
	sqlBytes, err := os.ReadFile("database.sql")
	if err != nil {
		return nil, fmt.Errorf("could not read database.sql: %v", err)
	}

	connStr := fmt.Sprintf(
		"user=%s password=%s host=%s port=%d dbname=%s sslmode=disable",
		cfg.Database.User,
		cfg.Database.Password,
		cfg.Database.Host,
		cfg.Database.Port,
		cfg.Database.DBName,
	)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("could not open database connection: %v", err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		return nil, fmt.Errorf("could not ping database: %v", err)
	}

	_, err = db.Exec(string(sqlBytes))
	if err != nil {
		return nil, fmt.Errorf("could not execute initial sql: %v", err)
	}

	return db, nil
}
