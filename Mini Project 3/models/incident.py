from datetime import datetime
from utils.classifier import detect_type, detect_severity

_RANK = {"critical": 0, "high": 1, "medium": 2, "low": 3}


class Incident:
    _REQUIRED = {"id", "title", "description", "reported_by", "timestamp", "assigned_team"}

    def __init__(self, id, title, description, reported_by, timestamp, assigned_team):
        self.id            = id
        self.title         = title
        self.description   = description
        self.reported_by   = reported_by
        self.timestamp     = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
        self.assigned_team = assigned_team
        self._severity     = None
        self.ticket_ids    = {}
        self.incident_type = "general"

    def classify(self):
        raise NotImplementedError("subclasses must implement classify()")

    @property
    def severity(self):
        return self._severity

    def to_dict(self):
        return {
            "id": self.id, "title": self.title, "description": self.description,
            "reported_by": self.reported_by, "timestamp": self.timestamp.isoformat(),
            "assigned_team": self.assigned_team, "severity": self._severity,
            "incident_type": self.incident_type, "ticket_ids": self.ticket_ids,
        }

    def __str__(self):
        return f"[{self.id}] {self.title} | type={self.incident_type} severity={self._severity}"

    def __repr__(self):
        return f"{self.__class__.__name__}(id={self.id!r}, severity={self._severity!r})"

    def __lt__(self, other):
        return _RANK.get(self._severity, 99) < _RANK.get(other._severity, 99)

    @staticmethod
    def validate_schema(record):
        missing = Incident._REQUIRED - record.keys()
        if missing:
            print(f"  [WARN] record {record.get('id','?')} missing: {missing}")
            return False
        return True


class NetworkIncident(Incident):
    def __init__(self, *args, affected_host="unknown", protocol="unknown", **kwargs):
        super().__init__(*args, **kwargs)
        self.affected_host = affected_host
        self.protocol      = protocol
        self.incident_type = "network"

    def classify(self):
        self._severity = detect_severity(f"{self.title} {self.description}")

    def escalate(self):
        print(f"  [ESCALATE] {self.id} | host={self.affected_host} | protocol={self.protocol}")


class AppIncident(Incident):
    def __init__(self, *args, app_name="unknown", error_code="N/A", **kwargs):
        super().__init__(*args, **kwargs)
        self.app_name      = app_name
        self.error_code    = error_code
        self.incident_type = "app"

    def classify(self):
        self._severity = detect_severity(f"{self.title} {self.description}")

    def get_stack_trace(self):
        return f"[STACK TRACE] {self.id} | app={self.app_name} | error={self.error_code}"


class SecurityIncident(Incident):
    def __init__(self, *args, threat_type="unknown", source_ip="0.0.0.0", **kwargs):
        super().__init__(*args, **kwargs)
        self.threat_type   = threat_type
        self.source_ip     = source_ip
        self.incident_type = "security"

    def classify(self):
        self._severity = detect_severity(f"{self.title} {self.description}")

    def notify_soc(self):
        print(f"  [SOC ALERT] {self.id} | threat={self.threat_type} | ip={self.source_ip}")


# iterator that steps through incidents with optional severity filter
class IncidentIterator:
    def __init__(self, incidents, severity_filter=None):
        self._incidents = incidents
        self._filter    = severity_filter
        self._index     = 0

    def __iter__(self): return self

    def __next__(self):
        while self._index < len(self._incidents):
            inc = self._incidents[self._index]
            self._index += 1
            if self._filter is None or inc.severity == self._filter:
                return inc
        raise StopIteration


# yields incidents in batches of batch_size
def batch_incidents(incidents, batch_size=3):
    for i in range(0, len(incidents), batch_size):
        yield incidents[i: i + batch_size]


# creates the right Incident subclass from a raw record dict
def incident_factory(record):
    text   = f"{record['title']} {record['description']}"
    kind   = detect_type(text)
    common = {k: record[k] for k in Incident._REQUIRED}
    if kind == "network":
        return NetworkIncident(**common, affected_host=record.get("affected_host", "unknown"),
                                protocol=record.get("protocol", "unknown"))
    if kind == "security":
        return SecurityIncident(**common, threat_type=record.get("threat_type", "unknown"),
                                source_ip=record.get("source_ip", "0.0.0.0"))
    return AppIncident(**common, app_name=record.get("app_name", "unknown"),
                                error_code=record.get("error_code", "N/A"))
