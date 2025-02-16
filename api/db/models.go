package db

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username    string
	Email       string
	Password    string
	DisplayName *string
	StreamName  *string
	Bio         *string
}
