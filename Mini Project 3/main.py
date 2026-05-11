import json, logging, os, sys

import config
logging.basicConfig(level=getattr(logging, config.LOG_LEVEL, logging.INFO),
                    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
                    datefmt="%H:%M:%S")
logger = logging.getLogger("main")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from models.incident import Incident, batch_incidents, incident_factory, NetworkIncident, SecurityIncident
from models.report import ReportGenerator
from services import servicenow, jira, azure_boards
from utils.helpers import get_critical_incidents, count_by_team, group_by_type


def load_incidents(path):
    with open(path, encoding="utf-8") as f:
        records = json.load(f)
    incidents = []
    for r in records:
        if not Incident.validate_schema(r):
            continue
        inc = incident_factory(r)
        inc.classify()
        incidents.append(inc)
    logger.info(f"loaded and classified {len(incidents)} incidents")
    return incidents


# pushes tickets to ServiceNow, Jira, and Azure Boards (all simulated)
def push_tickets(incidents):
    for batch in batch_incidents(incidents, batch_size=3):
        for inc in batch:
            inc.ticket_ids["snow"]  = servicenow.create_incident(inc)
            inc.ticket_ids["jira"]  = jira.create_issue(inc)
            inc.ticket_ids["azure"] = azure_boards.create_work_item(inc)


def post_process(incidents):
    for inc in incidents:
        if isinstance(inc, SecurityIncident):
            inc.notify_soc()
        elif isinstance(inc, NetworkIncident) and inc.severity in ("critical", "high"):
            inc.escalate()


def print_summary(incidents):
    sep = "-" * 55
    print(f"\n{sep}\n  {'TRIAGE SUMMARY':^51}\n{sep}")
    for itype, grp in group_by_type(incidents).items():
        print(f"  {itype:<12} -> {len(grp)} incident(s)")
    print()
    for team, cnt in sorted(count_by_team(incidents).items()):
        print(f"  {team:<22} {cnt} ticket(s)")
    crits = get_critical_incidents(incidents)
    print(f"\n  Critical : {len(crits)}")
    for inc in crits:
        print(f"    >> {inc}")
    print(sep)


def main():
    incidents = sorted(load_incidents(os.path.join(BASE_DIR, "data", "incidents.json")))

    print(f"\n[*] IT Incident Auto-Triage & Tracker  |  Total Incidents: {len(incidents)}\n")
    print("  Pushing tickets...")
    push_tickets(incidents)

    print()
    post_process(incidents)

    reporter  = ReportGenerator(incidents, output_dir=os.path.join(BASE_DIR, "output"))
    html_path = reporter.generate_html()
    json_path = reporter.export_json()
    print(f"\n  [OK] HTML -> {html_path}")
    print(f"  [OK] JSON -> {json_path}")

    print_summary(incidents)


if __name__ == "__main__":
    main()
