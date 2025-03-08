package handlers

import (
	"database/sql"
	"encoding/json"
	"time"

	"github.com/MisterKirill/blaze/api/models"
	"github.com/gofiber/contrib/websocket"
)

type OutputMessage struct {
	Username    string  `json:"username"`
	DisplayName *string `json:"display_name"`
	CreatedAt   int64   `json:"created_at"`
	Body        string  `json:"body"`
}

func WebSocketChatHandler(c *websocket.Conn, db *sql.DB) {
	user := c.Locals("user").(models.User)

	for {
		mt, msgString, err := c.ReadMessage()
		if err != nil {
			break
		}

		var msg struct {
			Body string `json:"body"`
		}
		if err := json.Unmarshal(msgString, &msg); err != nil {
			continue
		}

		if msg.Body == "" || len(msg.Body) > 1000 {
			continue
		}

		outMsgString, err := json.Marshal(OutputMessage{
			Username:    user.Username,
			DisplayName: user.DisplayName,
			CreatedAt:   time.Now().Unix(),
			Body:        msg.Body,
		})
		if err != nil {
			break
		}

		if err := c.WriteMessage(mt, outMsgString); err != nil {
			break
		}
	}
}
