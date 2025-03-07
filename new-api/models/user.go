package models

import "time"

type User struct {
	ID          int
	Username    string
	Email       string
	CreatedAt   time.Time
	Password    string
	Bio         *string
	DisplayName *string
	StreamName  *string
	StreamKey   string
}

type SafeUser struct {
	Username    string
	Bio         *string
	DisplayName *string
	StreamName  *string
}
