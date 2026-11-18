// Package config loads notifier settings from environment variables.
package config

import (
	"fmt"
	"os"
	"strconv"
	"time"
)

// Config holds runtime settings for the notifier daemon.
type Config struct {
	Addr          string
	APIToken      string
	MaxPerMinute  int
	QuietStart    int // hour of day, 0-23, in QuietTimezone
	QuietEnd      int
	QuietTimezone string
	RetryAttempts int
	RetryBase     time.Duration
}

func getenv(key, fallback string) string {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		return v
	}
	return fallback
}

func getInt(key string, fallback int) (int, error) {
	raw := getenv(key, "")
	if raw == "" {
		return fallback, nil
	}
	n, err := strconv.Atoi(raw)
	if err != nil {
		return 0, fmt.Errorf("%s must be an integer: %w", key, err)
	}
	return n, nil
}

// Load reads configuration and validates it.
func Load() (Config, error) {
	var cfg Config
	var err error
	cfg.Addr = getenv("NOTIFIER_ADDR", ":8090")
	cfg.APIToken = getenv("NOTIFIER_API_TOKEN", "")
	cfg.QuietTimezone = getenv("NOTIFIER_QUIET_TZ", "America/New_York")
	if cfg.MaxPerMinute, err = getInt("NOTIFIER_MAX_PER_MINUTE", 60); err != nil {
		return cfg, err
	}
	if cfg.QuietStart, err = getInt("NOTIFIER_QUIET_START", 21); err != nil {
		return cfg, err
	}
	if cfg.QuietEnd, err = getInt("NOTIFIER_QUIET_END", 7); err != nil {
		return cfg, err
	}
	if cfg.RetryAttempts, err = getInt("NOTIFIER_RETRY_ATTEMPTS", 3); err != nil {
		return cfg, err
	}
	cfg.RetryBase = 500 * time.Millisecond
	return cfg, cfg.Validate()
}

// Validate reports configuration errors.
func (c Config) Validate() error {
	switch {
	case c.MaxPerMinute <= 0:
		return fmt.Errorf("max per minute must be positive, got %d", c.MaxPerMinute)
	case c.QuietStart < 0 || c.QuietStart > 23 || c.QuietEnd < 0 || c.QuietEnd > 23:
		return fmt.Errorf("quiet hours must be within 0-23")
	case c.RetryAttempts < 1:
		return fmt.Errorf("retry attempts must be at least 1")
	}
	if _, err := time.LoadLocation(c.QuietTimezone); err != nil {
		return fmt.Errorf("unknown quiet timezone %q: %w", c.QuietTimezone, err)
	}
	return nil
}
