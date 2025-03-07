package models

import (
	"database/sql"
	"time"
)

type User struct {
	ID          int
	Username    string
	Email       string
	CreatedAt   time.Time
	Password    string
	Bio         sql.NullString
	DisplayName sql.NullString
	StreamName  sql.NullString
	StreamKey   string
}
