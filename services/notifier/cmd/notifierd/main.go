// Command notifierd delivers appointment, lab and prescription reminders.
package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/your-org/truewell/services/notifier/internal/config"
	"github.com/your-org/truewell/services/notifier/internal/dispatch"
	"github.com/your-org/truewell/services/notifier/internal/httpapi"
	"github.com/your-org/truewell/services/notifier/internal/quiet"
	"github.com/your-org/truewell/services/notifier/internal/ratelimit"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	cfg, err := config.Load()
	if err != nil {
		logger.Error("invalid configuration", "err", err)
		os.Exit(2)
	}
	loc, _ := time.LoadLocation(cfg.QuietTimezone)

	senders := map[string]dispatch.Sender{}
	for _, ch := range []string{"EMAIL", "SMS", "PUSH"} {
		senders[ch] = dispatch.LogSender{Channel: ch, Logger: logger}
	}
	d := &dispatch.Dispatcher{
		Senders:  senders,
		Limiter:  ratelimit.New(cfg.MaxPerMinute, time.Minute),
		Quiet:    quiet.Window{StartHour: cfg.QuietStart, EndHour: cfg.QuietEnd, Location: loc},
		Attempts: cfg.RetryAttempts,
		Backoff:  cfg.RetryBase,
		Now:      time.Now,
		Sleep:    time.Sleep,
	}

	srv := &http.Server{
		Addr:              cfg.Addr,
		Handler:           (&httpapi.Server{D: d, Token: cfg.APIToken}).Handler(),
		ReadHeaderTimeout: 5 * time.Second,
	}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	go func() {
		logger.Info("notifierd listening", "addr", cfg.Addr, "version", version)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("server error", "err", err)
			stop()
		}
	}()
	<-ctx.Done()
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_ = srv.Shutdown(shutdownCtx)
}
