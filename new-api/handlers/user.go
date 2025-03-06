package handlers

import "github.com/gofiber/fiber/v3"

func SearchUsersHandler(c fiber.Ctx) error {
	return c.SendString("SearchUsersHandler")
}

func GetUserHandler(c fiber.Ctx) error {
	return c.SendString("GetUserHandler")
}

func GetMeHandler(c fiber.Ctx) error {
	return c.SendString("GetMeHandler")
}

func UpdateMeHandler(c fiber.Ctx) error {
	return c.SendString("UpdateMeHandler")
}

func FollowUserHandler(c fiber.Ctx) error {
	return c.SendString("FollowUserHandler")
}

func UnfollowUserHandler(c fiber.Ctx) error {
	return c.SendString("UnfollowUserHandler")
}
