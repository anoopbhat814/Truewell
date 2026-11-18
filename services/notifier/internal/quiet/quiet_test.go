package quiet

import (
	"testing"
	"time"
)

func window(t *testing.T) Window {
	t.Helper()
	loc, err := time.LoadLocation("UTC")
	if err != nil {
		t.Fatal(err)
	}
	return Window{StartHour: 21, EndHour: 7, Location: loc}
}

func TestContainsWrapsMidnight(t *testing.T) {
	w := window(t)
	cases := map[int]bool{20: false, 21: true, 23: true, 0: true, 6: true, 7: false, 12: false}
	for hour, want := range cases {
		at := time.Date(2025, 5, 1, hour, 30, 0, 0, time.UTC)
		if got := w.Contains(at); got != want {
			t.Errorf("hour %d: got %v want %v", hour, got, want)
		}
	}
}

func TestNextOpen(t *testing.T) {
	w := window(t)
	late := time.Date(2025, 5, 1, 23, 0, 0, 0, time.UTC)
	if got, want := w.NextOpen(late), time.Date(2025, 5, 2, 7, 0, 0, 0, time.UTC); !got.Equal(want) {
		t.Errorf("late: got %v want %v", got, want)
	}
	early := time.Date(2025, 5, 1, 3, 0, 0, 0, time.UTC)
	if got, want := w.NextOpen(early), time.Date(2025, 5, 1, 7, 0, 0, 0, time.UTC); !got.Equal(want) {
		t.Errorf("early: got %v want %v", got, want)
	}
	noon := time.Date(2025, 5, 1, 12, 0, 0, 0, time.UTC)
	if !w.NextOpen(noon).Equal(noon) {
		t.Error("outside the window the time must be unchanged")
	}
}

func TestEmptyWindowNeverQuiet(t *testing.T) {
	w := Window{StartHour: 8, EndHour: 8, Location: time.UTC}
	if w.Contains(time.Date(2025, 5, 1, 8, 0, 0, 0, time.UTC)) {
		t.Error("equal start/end should disable quiet hours")
	}
}
