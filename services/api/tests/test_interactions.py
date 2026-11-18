from app.services.interactions import conflicts_with_allergy, find_interactions


def test_major_interaction_is_sorted_first():
    found = find_interactions("Warfarin", ["Ibuprofen", "Acetaminophen"])
    assert found == [{"with": "Ibuprofen", "severity": "major", "note": "Increased bleeding risk"}]


def test_interaction_is_case_insensitive_and_symmetric():
    assert find_interactions("LISINOPRIL", ["Potassium Chloride"])
    assert find_interactions("potassium chloride", ["lisinopril"])


def test_no_interaction():
    assert find_interactions("Metformin Hydrochloride", ["Lisinopril"]) == []


def test_allergy_matching():
    assert conflicts_with_allergy("Amoxicillin 500 mg", ["amoxicillin"])
    assert not conflicts_with_allergy("Lisinopril", ["penicillin"])
