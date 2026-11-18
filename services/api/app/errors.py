from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class DomainError(Exception):
    status_code = 400
    code = "domain_error"

    def __init__(self, message: str, *, details: dict | None = None) -> None:
        super().__init__(message)
        self.message = message
        self.details = details or {}


class NotFoundError(DomainError):
    status_code = 404
    code = "not_found"


class ConflictError(DomainError):
    status_code = 409
    code = "conflict"


class ForbiddenError(DomainError):
    status_code = 403
    code = "forbidden"


class AuthenticationError(DomainError):
    status_code = 401
    code = "unauthenticated"


class ValidationFailed(DomainError):
    status_code = 422
    code = "validation_failed"


class RateLimited(DomainError):
    status_code = 429
    code = "rate_limited"


def install_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(DomainError)
    async def _domain_error(_: Request, exc: DomainError) -> JSONResponse:
        body = {"error": {"code": exc.code, "message": exc.message, "details": exc.details}}
        return JSONResponse(status_code=exc.status_code, content=body)
