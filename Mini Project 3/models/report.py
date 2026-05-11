# models/report.py
import json, os
from datetime import datetime, timezone

_BADGE = {"critical": "#dc2626", "high": "#ea580c", "medium": "#ca8a04", "low": "#16a34a"}

_CSS = """
<style>
  body     { font-family: Segoe UI, sans-serif; background: #f4f6f9; color: #1a1d27; padding: 2rem; }
  h1       { color: #000000; margin-bottom: .3rem;margin-top:0;padding:0 }
  .subtitle { color: #6b7280; font-size: .85rem; margin-bottom: 1.5rem; }
  .kpi-grid { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .kpi      { background: #fff; border: 1px solid #dde1ea; border-radius: 8px;
              padding: 1rem 1.5rem; text-align: center; min-width: 90px; }
  .kpi .value { font-size: 1.8rem; font-weight: 700; }
  .kpi .label { font-size: .7rem; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; }
  .kpi.total    .value { color: #4f46e5; }
  .kpi.critical .value { color: #dc2626; }
  .kpi.high     .value { color: #ea580c; }
  .kpi.medium   .value { color: #ca8a04; }
  .kpi.low      .value { color: #16a34a; }
  table { width: 100%; border-collapse: collapse; background: #fff;
          border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
  th    { background: #eef0f5; color: #6b7280; font-size: .72rem; text-transform: uppercase;
          letter-spacing: 1px; padding: .7rem 1rem; text-align: left; border-bottom: 1px solid #dde1ea; }
  td    { padding: .65rem 1rem; border-bottom: 1px solid #dde1ea; font-size: .875rem; }
  tr:last-child td  { border-bottom: none; }
  tr:hover      td  { background: #f0f1ff; }
  .badge  { padding: 2px 10px; border-radius: 20px; font-size: .72rem;
            font-weight: 600; color: #fff; text-transform: uppercase; }
  code    { background: #eef0f5; border: 1px solid #dde1ea; padding: 1px 6px;
            border-radius: 4px; font-size: .78rem; color: #4f46e5; }
  footer  { margin-top: 1.5rem; color: #6b7280; font-size: .78rem; text-align: center; }
</style>
"""


# writes an HTML dashboard and JSON summary from processed incidents
class ReportGenerator:
    def __init__(self, incidents, output_dir="output"):
        self.incidents  = incidents
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

    def generate_html(self):
        counts = {}
        for i in self.incidents:
            counts[i.severity] = counts.get(i.severity, 0) + 1

        kpis = (
            f'<div class="kpi total"><div class="value">{len(self.incidents)}</div><div class="label">Total</div></div>'
            f'<div class="kpi critical"><div class="value">{counts.get("critical",0)}</div><div class="label">Critical</div></div>'
            f'<div class="kpi high"><div class="value">{counts.get("high",0)}</div><div class="label">High</div></div>'
            f'<div class="kpi medium"><div class="value">{counts.get("medium",0)}</div><div class="label">Medium</div></div>'
            f'<div class="kpi low"><div class="value">{counts.get("low",0)}</div><div class="label">Low</div></div>'
        )

        rows = "\n".join(self._row(i) for i in self.incidents)
        generated = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

        html = (
            f"<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'>"
            f"<title>IT Incident Auto-Triage Report</title>{_CSS}</head><body>"
            f"<h1>IT Incident Auto-Triage & Tracker</h1>"
            f"<p class='subtitle'>Generated: {generated} | Total Incidents: {len(self.incidents)}</p>"
            f'<div class="kpi-grid">{kpis}</div>'
            f"<table><thead><tr>"
            f"<th>ID</th><th>Title</th><th>Type</th><th>Severity</th>"
            f"<th>Team</th><th>Tickets</th><th>Reported</th>"
            f"</tr></thead><tbody>{rows}</tbody></table>"
            f"<footer>IT Incident Auto-Triage & Tracker - B2.NET_Python_Batch_Mini_Project_3</footer>"
            f"</body></html>"
        )

        path = os.path.join(self.output_dir, "report.html")
        with open(path, "w", encoding="utf-8") as f:
            f.write(html)
        return path

    def export_json(self):
        path = os.path.join(self.output_dir, "report.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump({"generated_at": datetime.now(timezone.utc).isoformat(),
                       "total": len(self.incidents),
                       "incidents": [i.to_dict() for i in self.incidents]},
                      f, indent=2, default=str)
        return path

    def _row(self, inc):
        colour  = _BADGE.get(inc.severity, "#6b7280")
        tickets = " ".join(f"<code>{v}</code>" for v in inc.ticket_ids.values()) or "-"
        return (
            f"<tr><td>{inc.id}</td><td>{inc.title}</td>"
            f"<td>{inc.incident_type}</td>"
            f"<td><span class='badge' style='background:{colour}'>{inc.severity}</span></td>"
            f"<td>{inc.assigned_team}</td><td>{tickets}</td>"
            f"<td>{inc.timestamp.strftime('%Y-%m-%d %H:%M')}</td></tr>"
        )
