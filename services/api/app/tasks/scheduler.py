"""Lightweight interval scheduler used by the `truewell-tasks` process."""

import logging
import signal
import time
from collections.abc import Callable
from dataclasses import dataclass

log = logging.getLogger("truewell.tasks")


@dataclass
class Job:
    name: str
    every_seconds: int
    fn: Callable[[], int]
    next_run: float = 0.0


class Scheduler:
    def __init__(self, jobs: list[Job]) -> None:
        self.jobs = jobs
        self._running = True

    def stop(self, *_: object) -> None:
        self._running = False

    def run_once(self, now: float | None = None) -> dict[str, int]:
        now = time.monotonic() if now is None else now
        results: dict[str, int] = {}
        for job in self.jobs:
            if now < job.next_run:
                continue
            try:
                results[job.name] = job.fn()
            except Exception:  # keep the loop alive; failures are visible in logs
                log.exception("job failed", extra={"ctx": {"job": job.name}})
            job.next_run = now + job.every_seconds
        return results

    def run_forever(self, tick: float = 1.0) -> None:
        signal.signal(signal.SIGTERM, self.stop)
        signal.signal(signal.SIGINT, self.stop)
        while self._running:
            self.run_once()
            time.sleep(tick)
