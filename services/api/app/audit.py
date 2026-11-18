import json
import logging
from typing import Any

from sqlalchemy.orm import Session

from app.core.rbac import Principal
from app.models.audit_log import AuditLog

log = logging.getLogger("truewell.audit")


def record(
    session: Session,
    actor: Principal | None,
    action: str,
    entity_type: str,
    entity_id: str,
    metadata: dict[str, Any] | None = None,
    ip_address: str | None = None,
) -> AuditLog:
    """Persist an immutable audit entry for any read or write touching PHI."""
    entry = AuditLog(
        actor_id=actor.user_id if actor else None,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        ip_address=ip_address,
        metadata_json=json.dumps(metadata) if metadata else None,
    )
    session.add(entry)
    log.info("audit", extra={"ctx": {"action": action, "entity": entity_type, "entity_id": entity_id}})
    return entry
