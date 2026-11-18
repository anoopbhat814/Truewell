from app.pagination import Page


def test_has_more():
    assert Page[int](items=[1, 2], total=5, offset=0, limit=2).has_more
    assert not Page[int](items=[5], total=5, offset=4, limit=2).has_more
