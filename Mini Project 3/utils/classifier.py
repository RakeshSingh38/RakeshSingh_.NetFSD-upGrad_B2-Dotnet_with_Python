# utils/classifier.py - regex-based incident type and severity detection
import re


_NETWORK_PAT = re.compile(
    r"\b(\d{1,3}(?:\.\d{1,3}){3}|TCP|UDP|ICMP|VLAN|switch|firewall|"
    r"DNS|packet|router|network|latency|bandwidth|port)\b",
    re.IGNORECASE,
)

_SECURITY_PAT = re.compile(
    r"\b(breach|ransomware|brute.?force|malware|phishing|unauthorized|"
    r"intrusion|exploit|vulnerability|credential|threat|SOC)\b",
    re.IGNORECASE,
)

_APP_PAT = re.compile(
    r"\b(error\s*code|NullPointerException|HTTP-\d{3}|stack\s*trace|"
    r"exception|timeout|503|502|500|API|service|application|deploy|"
    r"crash|bug|null|stacktrace)\b",
    re.IGNORECASE,
)

_CRITICAL_PAT = re.compile(
    r"\b(outage|down|breach|ransomware|prod\b|critical|failure)\b",
    re.IGNORECASE,
)

_HIGH_PAT = re.compile(
    r"\b(timeout|failing|unavailable|unreachable|high|alert|"
    r"brute.?force|phishing|malware|unauthorized|intrusion|"
    r"exception|NullPointer|error.?code|HTTP-\d{3})\b",
    re.IGNORECASE,
)

_MEDIUM_PAT = re.compile(
    r"\b(slow|degraded|warning|intermittent|moderate|medium|misconfiguration)\b",
    re.IGNORECASE,
)


def detect_type(text: str) -> str:
    """returns 'network', 'security', 'app', or 'general' based on text content"""
    if _SECURITY_PAT.search(text):
        return "security"
    if _NETWORK_PAT.search(text):
        return "network"
    if _APP_PAT.search(text):
        return "app"
    return "general"


def detect_severity(text: str) -> str:
    """returns 'critical', 'high', 'medium', or 'low' based on keyword matches"""
    if _CRITICAL_PAT.search(text):
        return "critical"
    if _HIGH_PAT.search(text):
        return "high"
    if _MEDIUM_PAT.search(text):
        return "medium"
    return "low"
