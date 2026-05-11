# utils/helpers.py - functional helpers using map, filter, and reduce
from functools import reduce


# returns a list of incidents whose severity is 'critical'
def get_critical_incidents(incidents):
    return list(filter(lambda i: i.severity == "critical", incidents))


# maps each incident to its dict representation for api payload construction
def build_payloads(incidents):
    return list(map(lambda i: i.to_dict(), incidents))


# uses reduce to build a dict of {team_name: incident_count}
def count_by_team(incidents):
    return reduce(
        lambda acc, i: {**acc, i.assigned_team: acc.get(i.assigned_team, 0) + 1},
        incidents,
        {},
    )


# generator expression - yields incidents matching a given severity level
# using a generator avoids materialising the full filtered list in memory
def get_incidents_by_severity(incidents, severity: str):
    return (i for i in incidents if i.severity == severity)


# groups incidents into a dict keyed by their incident type string
def group_by_type(incidents):
    return reduce(
        lambda acc, i: {**acc, i.incident_type: acc.get(i.incident_type, []) + [i]},
        incidents,
        {},
    )
