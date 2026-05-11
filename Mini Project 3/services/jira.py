# services/jira.py - simulated Jira integration
import logging
from utils.decorators import log_call, retry

logger    = logging.getLogger(__name__)
_counter  = [0]


@log_call
@retry(times=3, delay=1)
def create_issue(incident) -> str:
    _counter[0] += 1
    mock_key = f"JIRA-{_counter[0]:03d}"
    print(f"  [Jira]       {incident.id} -> {mock_key}")
    return mock_key
