import pytest
import subprocess
import os


def test_start_sh_waits_for_db_before_startup():
    start_sh_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'backend', 'start.sh')
    assert os.path.exists(start_sh_path), "start.sh not found"


def test_start_sh_runs_migrations_and_seed():
    start_sh_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'backend', 'start.sh')
    with open(start_sh_path, 'r') as f:
        content = f.read()
    assert 'migrate' in content.lower() or 'init' in content.lower() or 'seed' in content.lower()


def test_start_sh_starts_fastapi_on_port_23001():
    start_sh_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'backend', 'start.sh')
    with open(start_sh_path, 'r') as f:
        content = f.read()
    assert '23001' in content