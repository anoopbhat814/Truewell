// Package httpapi exposes the notifier over HTTP.
package httpapi

import (
	"context"
	"crypto/subtle"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/your-org/truewell/services/notifier/internal/dispatch"
)

// Dispatcher is the subset of dispatch.Dispatcher the API needs.
type Dispatcher interface {
	Dispatch(ctx context.Context, req dispatch.Request) (dispatch.Result, error)
}

// Server wires routes.
type Server struct {
	D     Dispatcher
	Token string
}

// Handler returns the HTTP handler.
func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})
	mux.HandleFunc("POST /v1/dispatch", s.auth(s.dispatch))
	return mux
}

func (s *Server) auth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if s.Token != "" {
			got := r.Header.Get("Authorization")
			want := "Bearer " + s.Token
			if subtle.ConstantTimeCompare([]byte(got), []byte(want)) != 1 {
				writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
				return
			}
		}
		next(w, r)
	}
}

func (s *Server) dispatch(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 64<<10)
	var req dispatch.Request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON body"})
		return
	}
	res, err := s.D.Dispatch(r.Context(), req)
	switch {
	case errors.Is(err, dispatch.ErrThrottled):
		writeJSON(w, http.StatusTooManyRequests, res)
	case errors.Is(err, dispatch.ErrPermanent):
		writeJSON(w, http.StatusUnprocessableEntity, map[string]string{"error": err.Error()})
	case err != nil:
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": err.Error()})
	default:
		writeJSON(w, http.StatusOK, res)
	}
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}
