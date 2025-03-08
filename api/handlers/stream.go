package handlers

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/MisterKirill/blaze/api/config"
	"github.com/MisterKirill/blaze/api/models"
	"github.com/MisterKirill/blaze/mediamtx"
	"github.com/gofiber/fiber/v2"
)

func GetActiveStreamsHandler(c *fiber.Ctx, db *sql.DB, cfg *config.Config) error {
	client, err := mediamtx.New(cfg.MediaMTX.APIUrl)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to access MediaMTX API",
		})
	}

	paths, err := client.GetPaths(30)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get streams",
		})
	}

	var activeStreams = make([]models.ActiveStream, 0)

	for _, path := range paths.Items {
		id := path.Name[5:]

		var user models.SafeUser
		err := db.QueryRow(
			"SELECT username, bio, display_name, stream_name FROM users WHERE id = $1",
			id,
		).Scan(&user.Username, &user.Bio, &user.DisplayName, &user.StreamName)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to get user",
			})
		}

		streamUrl := fmt.Sprintf("%s/live/%s/index.m3u8", cfg.MediaMTX.HLSUrl, id)
		viewersCount := len(path.Readers)

		activeStream := models.ActiveStream{
			Url: streamUrl,
			ViewersCount: viewersCount,
			ReadyTime: path.ReadyTime,
			User: user,
		}

		activeStreams = append(activeStreams, activeStream)
	}

	return c.JSON(fiber.Map{
		"active_streams": activeStreams,
	})
}
