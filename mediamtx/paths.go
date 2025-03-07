package mediamtx

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Source struct {
	Type string
	Id   string
}

type Reader struct {
	Type string
	Id   string
}

type Path struct {
	Name          string
	ConfName      string
	Source        Source
	Ready         bool
	ReadyTime     string
	Tracks        []string
	BytesReceived int
	BytesSent     int
	Readers       []Reader
}

type PathsListResponse struct {
	PageCount int
	ItemCount int
	Items     []Path
}

func (m MediamtxAPI) GetPaths(itemsPerPage int) (PathsListResponse, error) {
	resp, err := http.Get(fmt.Sprintf("%s/v3/paths/list?itemsPerPage=%d", m.apiUrl, itemsPerPage))
	if err != nil {
		return PathsListResponse{}, err
	}

	var respBody PathsListResponse
	if err := json.NewDecoder(resp.Body).Decode(&respBody); err != nil {
		return PathsListResponse{}, err
	}

	return respBody, nil
}

func (m MediamtxAPI) GetPath(name string) (Path, error) {
	resp, err := http.Get(m.apiUrl + "/v3/paths/get/" + name)
	if err != nil {
		return Path{}, err
	}

	var respBody Path
	if err := json.NewDecoder(resp.Body).Decode(&respBody); err != nil {
		return Path{}, err
	}

	return respBody, nil
}
