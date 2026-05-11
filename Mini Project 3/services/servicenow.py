# services/servicenow.py - simulated ServiceNow integration
import logging
import config
from utils.decorators import log_call, retry

logger   = logging.getLogger(__name__)
_counter = [0]


@log_call
@retry(times=3, delay=1)
def create_incident(incident) -> str:
    _counter[0] += 1
    mock_id = f"MOCK-SNOW-{_counter[0]:03d}"
    print(f"  [ServiceNow] {incident.id} -> {mock_id}")
    return mock_id
