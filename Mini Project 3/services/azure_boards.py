# services/azure_boards.py - simulated Azure Boards integration
import logging
from utils.decorators import log_call, retry

logger    = logging.getLogger(__name__)
_counter  = [0]


@log_call
@retry(times=3, delay=1)
def create_work_item(incident) -> str:
    _counter[0] += 1
    mock_id = f"AZ-{_counter[0]:03d}"
    print(f"  [AzureBoards] {incident.id} -> {mock_id}")
    return mock_id
