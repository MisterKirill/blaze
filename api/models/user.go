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
	Username    string  `json:"username"`
	Bio         *string `json:"bio"`
	DisplayName *string `json:"display_name"`
	StreamName  *string `json:"stream_name"`
}

type AuthorizedUser struct {
	Username    string  `json:"username"`
	Email       string  `json:"email"`
	Bio         *string `json:"bio"`
	DisplayName *string `json:"display_name"`
	StreamName  *string `json:"stream_name"`
	StreamKey   string  `json:"stream_key"`
}
