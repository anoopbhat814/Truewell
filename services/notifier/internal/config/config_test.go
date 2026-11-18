package config

import "testing"

func TestLoadDefaults(t *testing.T) {
	t.Setenv("NOTIFIER_MAX_PER_MINUTE", "")
	cfg, err := Load()
	if err != nil {
		t.Fatalf("Load: %v", err)
	}
	if cfg.Addr != ":8090" || cfg.MaxPerMinute != 60 || cfg.RetryAttempts != 3 {
		t.Fatalf("unexpected defaults: %+v", cfg)
	}
}

func TestLoadRejectsBadInteger(t *testing.T) {
	t.Setenv("NOTIFIER_QUIET_START", "late")
	if _, err := Load(); err == nil {
		t.Fatal("expected error for non-numeric quiet start")
	}
}

func TestValidate(t *testing.T) {
	good := Config{MaxPerMinute: 1, QuietStart: 22, QuietEnd: 6, QuietTimezone: "UTC", RetryAttempts: 1}
	if err := good.Validate(); err != nil {
		t.Fatalf("good config rejected: %v", err)
	}
	bad := []Config{
		{MaxPerMinute: 0, QuietTimezone: "UTC", RetryAttempts: 1},
		{MaxPerMinute: 1, QuietStart: 30, QuietTimezone: "UTC", RetryAttempts: 1},
		{MaxPerMinute: 1, QuietTimezone: "Mars/Olympus", RetryAttempts: 1},
		{MaxPerMinute: 1, QuietTimezone: "UTC", RetryAttempts: 0},
	}
	for i, c := range bad {
		if c.Validate() == nil {
			t.Errorf("case %d should fail validation", i)
		}
	}
}
