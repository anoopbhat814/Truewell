from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_healthz():
    res = client.get("/healthz")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"
    assert res.headers["cache-control"] == "no-store"


def test_protected_route_requires_token():
    res = client.get("/api/v1/patients")
    assert res.status_code == 401
    assert res.json()["error"]["code"] == "unauthenticated"


def test_openapi_lists_core_routes():
    paths = client.get("/openapi.json").json()["paths"]
    for route in ("/api/v1/appointments", "/api/v1/prescriptions", "/api/v1/auth/login", "/api/v1/insurance/claims"):
        assert route in paths
