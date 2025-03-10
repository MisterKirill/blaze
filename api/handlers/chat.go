package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
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
	username := c.Params("username")

	var streamerId int
	err := db.QueryRow("SELECT id FROM users WHERE username = $1", username).Scan(&streamerId)
	if err != nil {
		log.Print(err)
		return
	}

	for {
		mt, msgString, err := c.ReadMessage()
		if err != nil {
			log.Print(err)
			break
		}

		var msg struct {
			Body string `json:"body"`
		}
		if err := json.Unmarshal(msgString, &msg); err != nil {
			log.Print(err)
			continue
		}

		if msg.Body == "" || len(msg.Body) > 1000 {
			continue
		}

		_, err = db.Exec(
			"INSERT INTO chat_messages (streamer_id, author_id, body) VALUES ($1, $2, $3)",
			streamerId, user.ID, msg.Body,
		)
		if err != nil {
			log.Print(err)
			break
		}

		outMsg := OutputMessage{
			Username:    user.Username,
			DisplayName: user.DisplayName,
			CreatedAt:   time.Now().Unix(),
			Body:        msg.Body,
		}

		outMsgString, err := json.Marshal(outMsg)
		if err != nil {
			log.Print(err)
			break
		}

		if err := c.WriteMessage(mt, outMsgString); err != nil {
			log.Print(err)
			break
		}
	}
}
