package mediamtx

import (
	"encoding/json"
	"net/http"
)

type Segment struct {
	Start string
}

type Recording struct {
	Name     string
	Segments []Segment
}

type RecordingsListResponse struct {
	PageCount int
	ItemCount int
	Items     []Recording
}

func (m MediamtxAPI) GetRecordings() (RecordingsListResponse, error) {
	resp, err := http.Get(m.apiUrl + "/v3/recordings/list")
	if err != nil {
		return RecordingsListResponse{}, err
	}

	var respBody RecordingsListResponse
	if err := json.NewDecoder(resp.Body).Decode(&respBody); err != nil {
		return RecordingsListResponse{}, err
	}

	return respBody, nil
}

func (m MediamtxAPI) GetRecording(pathName string) (Recording, error) {
	resp, err := http.Get(m.apiUrl + "/v3/recordings/get/" + pathName)
	if err != nil {
		return Recording{}, err
	}

	var respBody Recording
	if err := json.NewDecoder(resp.Body).Decode(&respBody); err != nil {
		return Recording{}, err
	}

	return respBody, nil
}
