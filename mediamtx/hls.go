package mediamtx

import (
	"encoding/json"
	"net/http"
)

type HLSMuxer struct {
	Path        string
	Created     string
	LastRequest string
	BytesSent   int
}

type HLSMuxerListResponse struct {
	PageCount int
	ItemCount int
	Items     []HLSMuxer
}

func (m MediamtxAPI) GetHLSMuxers() (HLSMuxerListResponse, error) {
	resp, err := http.Get(m.apiUrl + "/v3/hlsmuxers/list")
	if err != nil {
		return HLSMuxerListResponse{}, err
	}

	var respBody HLSMuxerListResponse
	if err := json.NewDecoder(resp.Body).Decode(&respBody); err != nil {
		return HLSMuxerListResponse{}, err
	}

	return respBody, nil
}

func (m MediamtxAPI) GetHLSMuxer(name string) (HLSMuxer, error) {
	resp, err := http.Get(m.apiUrl + "/v3/hlsmuxers/get/" + name)
	if err != nil {
		return HLSMuxer{}, err
	}

	var respBody HLSMuxer
	if err := json.NewDecoder(resp.Body).Decode(&respBody); err != nil {
		return HLSMuxer{}, err
	}

	return respBody, nil
}
