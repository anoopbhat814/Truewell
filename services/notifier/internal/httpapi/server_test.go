package httpapi

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/your-org/truewell/services/notifier/internal/dispatch"
)

type fake struct {
	res dispatch.Result
	err error
}

func (f fake) Dispatch(context.Context, dispatch.Request) (dispatch.Result, error) { return f.res, f.err }

func do(s *Server, method, path, body, token string) *httptest.ResponseRecorder {
	req := httptest.NewRequest(method, path, strings.NewReader(body))
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	rec := httptest.NewRecorder()
	s.Handler().ServeHTTP(rec, req)
	return rec
}

func TestAuthRequired(t *testing.T) {
	s := &Server{D: fake{}, Token: "secret"}
	if rec := do(s, "POST", "/v1/dispatch", `{}`, ""); rec.Code != http.StatusUnauthorized {
		t.Fatalf("status %d", rec.Code)
	}
	if rec := do(s, "POST", "/v1/dispatch", `{}`, "secret"); rec.Code != http.StatusOK {
		t.Fatalf("status %d", rec.Code)
	}
}

func TestErrorMapping(t *testing.T) {
	cases := map[int]error{
		http.StatusTooManyRequests:     dispatch.ErrThrottled,
		http.StatusUnprocessableEntity: dispatch.ErrPermanent,
		http.StatusBadGateway:          context.DeadlineExceeded,
	}
	for want, err := range cases {
		if rec := do(&Server{D: fake{err: err}}, "POST", "/v1/dispatch", `{}`, ""); rec.Code != want {
			t.Errorf("%v: got %d want %d", err, rec.Code, want)
		}
	}
}
