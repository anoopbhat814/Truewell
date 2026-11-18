from app.tasks.scheduler import Job, Scheduler


def test_jobs_run_when_due_and_respect_interval():
    calls = []
    sched = Scheduler([Job("a", 60, lambda: calls.append("a") or 1), Job("b", 10, lambda: calls.append("b") or 2)])
    assert sched.run_once(now=0) == {"a": 1, "b": 2}
    assert sched.run_once(now=5) == {}
    assert sched.run_once(now=10) == {"b": 2}
    assert calls == ["a", "b", "b"]


def test_failing_job_does_not_stop_others():
    def boom():
        raise RuntimeError("fail")

    sched = Scheduler([Job("bad", 1, boom), Job("good", 1, lambda: 7)])
    assert sched.run_once(now=0) == {"good": 7}
