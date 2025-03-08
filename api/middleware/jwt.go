package middleware

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"

	"github.com/MisterKirill/blaze/api/config"
	"github.com/MisterKirill/blaze/api/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
)

func JwtMiddleware(db *sql.DB, cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Authorization header not provided",
			})
		}

		if !strings.HasPrefix(authHeader, "Bearer ") {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid authorization header format",
			})
		}
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}

			return []byte(cfg.JwtSecret), nil
		})
		if err != nil {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Failed to parse token",
			})
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Failed to validate token",
			})
		}

		var user models.User
		err = db.QueryRow("SELECT id, username, email, created_at, password, bio, display_name, stream_name, stream_key FROM users WHERE id = $1", claims["user_id"]).Scan(
			&user.ID,
			&user.Username,
			&user.Email,
			&user.CreatedAt,
			&user.Password,
			&user.Bio,
			&user.DisplayName,
			&user.StreamName,
			&user.StreamKey,
		)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to get user",
			})
		}

		c.Locals("user", user)

		return c.Next()
	}
}
