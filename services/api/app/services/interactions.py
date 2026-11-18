"""A small, auditable interaction table. Production deployments should plug in a licensed drug database."""

INTERACTIONS: dict[frozenset[str], tuple[str, str]] = {
    frozenset({"lisinopril", "potassium chloride"}): ("major", "Risk of hyperkalemia"),
    frozenset({"alprazolam", "oxycodone"}): ("major", "Additive respiratory depression"),
    frozenset({"metformin hydrochloride", "iodinated contrast"}): ("moderate", "Risk of lactic acidosis"),
    frozenset({"atorvastatin calcium", "clarithromycin"}): ("major", "Increased statin exposure"),
    frozenset({"warfarin", "ibuprofen"}): ("major", "Increased bleeding risk"),
}

SEVERITY_RANK = {"minor": 1, "moderate": 2, "major": 3}


def find_interactions(new_drug: str, active_drugs: list[str]) -> list[dict[str, str]]:
    found = []
    new_key = new_drug.strip().lower()
    for other in active_drugs:
        pair = frozenset({new_key, other.strip().lower()})
        if pair in INTERACTIONS:
            severity, note = INTERACTIONS[pair]
            found.append({"with": other, "severity": severity, "note": note})
    return sorted(found, key=lambda i: -SEVERITY_RANK[i["severity"]])


def conflicts_with_allergy(drug_name: str, allergies: list[str]) -> bool:
    name = drug_name.lower()
    return any(a.lower() in name or name in a.lower() for a in allergies)
