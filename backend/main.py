"""
Cisco Catalyst 9300 — Live Switch Monitor
Backend: Python FastAPI + Netmiko SSH
Read-only: only 'show' commands are ever sent to switches
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import asyncio
import json
import re
import time
from datetime import datetime
from pathlib import Path

# ── Netmiko (install: pip install netmiko) ────────────────────────────────────
try:
    from netmiko import ConnectHandler, NetmikoTimeoutException, NetmikoAuthenticationException
    NETMIKO_AVAILABLE = True
except ImportError:
    NETMIKO_AVAILABLE = False
    print("⚠  netmiko not installed — running in DEMO mode (pip install netmiko)")

app = FastAPI(title="Cisco 9300 Live Monitor", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten in production
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ═══════════════════════════════════════════════════════════════════════════════
# SWITCH LIST  ─ edit this file or load from switches.json
# ═══════════════════════════════════════════════════════════════════════════════
SWITCHES_FILE = Path(__file__).parent / "switches.json"

# Default list — replace with your real switches
DEFAULT_SWITCHES = [
    {"name": "SW-CORE-01",    "host": "192.168.1.1",  "location": "Server Room A", "model": "C9300-48P"},
    {"name": "SW-ACCESS-02",  "host": "192.168.1.2",  "location": "Floor 2",       "model": "C9300-48P"},
    {"name": "SW-ACCESS-03",  "host": "192.168.1.3",  "location": "Floor 3",       "model": "C9300-48T"},
    {"name": "SW-DIST-01",    "host": "192.168.1.10", "location": "Comms Room B",  "model": "C9300-48P"},
]

def load_switches():
    if SWITCHES_FILE.exists():
        return json.loads(SWITCHES_FILE.read_text())
    # Write defaults on first run
    SWITCHES_FILE.write_text(json.dumps(DEFAULT_SWITCHES, indent=2))
    return DEFAULT_SWITCHES

# ── SSH credentials ────────────────────────────────────────────────────────────
# Set via environment variables or edit directly here
import os
SSH_USERNAME = os.getenv("SWITCH_USER", "readonly")
SSH_PASSWORD = os.getenv("SWITCH_PASS", "your_password_here")
SSH_SECRET   = os.getenv("SWITCH_SECRET", "")   # enable secret if needed
SSH_PORT     = int(os.getenv("SWITCH_PORT", "22"))
SSH_TIMEOUT  = int(os.getenv("SWITCH_TIMEOUT", "15"))

# ── In-memory cache (avoid hammering switches on every request) ───────────────
_cache: dict = {}
CACHE_TTL = 60  # seconds

def cache_get(key: str):
    if key in _cache:
        data, ts = _cache[key]
        if time.time() - ts < CACHE_TTL:
            return data
    return None

def cache_set(key: str, data):
    _cache[key] = (data, time.time())

# ═══════════════════════════════════════════════════════════════════════════════
# NETMIKO SSH  ─ read-only show commands only
# ═══════════════════════════════════════════════════════════════════════════════

def ssh_connect(host: str):
    """Open SSH connection to a Cisco IOS-XE device."""
    device = {
        "device_type":   "cisco_ios",
        "host":          host,
        "username":      SSH_USERNAME,
        "password":      SSH_PASSWORD,
        "secret":        SSH_SECRET,
        "port":          SSH_PORT,
        "timeout":       SSH_TIMEOUT,
        "conn_timeout":  SSH_TIMEOUT,
        "fast_cli":      True,
    }
    return ConnectHandler(**device)

def run_show(host: str, command: str) -> str:
    """Execute a single show command and return output."""
    # Safety guard — never allow config commands
    cmd = command.strip().lower()
    if not cmd.startswith("show") and not cmd.startswith("terminal") and not cmd.startswith("sh "):
        raise ValueError(f"Only 'show' commands allowed, got: {command}")
    with ssh_connect(host) as conn:
        return conn.send_command(command, read_timeout=30)

def run_show_multi(host: str, commands: list[str]) -> dict[str, str]:
    """Run multiple show commands in a single SSH session."""
    for cmd in commands:
        c = cmd.strip().lower()
        if not c.startswith("show") and not c.startswith("terminal") and not c.startswith("sh "):
            raise ValueError(f"Only 'show' commands allowed, got: {cmd}")
    results = {}
    with ssh_connect(host) as conn:
        for cmd in commands:
            results[cmd] = conn.send_command(cmd, read_timeout=30)
    return results

# ═══════════════════════════════════════════════════════════════════════════════
# PARSERS  ─ extract structured data from Cisco CLI output
# ═══════════════════════════════════════════════════════════════════════════════

def parse_interfaces_status(raw: str) -> list[dict]:
    """
    Parse: show interfaces status
    Port      Name               Status       Vlan       Duplex  Speed Type
    Gi1/0/1   Workstation-01     connected    10         a-full  a-100 10/100/1000BaseTX
    Gi1/0/2                      notconnect   1          auto    auto  10/100/1000BaseTX
    """
    ports = []
    for line in raw.splitlines():
        m = re.match(
            r'^(Gi\S+|Te\S+|Fa\S+)\s+'       # interface
            r'(\S.*?)?\s{2,}'                  # name (optional)
            r'(\S+)\s+'                        # status
            r'(\S+)\s+'                        # vlan
            r'(\S+)\s+'                        # duplex
            r'(\S+)\s+'                        # speed
            r'(.+)?$',                         # type
            line
        )
        if m:
            iface, name, status, vlan, duplex, speed, itype = m.groups()
            # Normalise
            if status == "connected":
                st = "up"
            elif status in ("disabled", "err-disabled"):
                st = "disabled"
            else:
                st = "down"

            # Speed cleanup
            spd = speed.replace("a-", "").replace("G", "000").upper()
            if "1000" in spd or "1G" in spd.upper():
                spd = "1000"
            elif "100" in spd:
                spd = "100"
            elif "10G" in spd.upper() or "10000" in spd:
                spd = "10000"
            else:
                spd = speed.replace("a-", "")

            ports.append({
                "id":          iface,
                "description": (name or "").strip(),
                "status":      st,
                "vlan":        vlan if vlan.isdigit() else 1,
                "duplex":      duplex,
                "speed":       spd,
            })
    return ports

def parse_interfaces_detail(raw: str) -> dict:
    """
    Parse: show interfaces  (full detail output)
    Returns dict keyed by interface name with error counters, rates, etc.
    """
    result = {}
    current = None
    for line in raw.splitlines():
        # Interface header line
        m = re.match(r'^(Gi\S+|Te\S+|Fa\S+) is (\S+)', line)
        if m:
            current = m.group(1)
            result[current] = {
                "admin_status": "up" if "up" in m.group(2) else "down",
                "rx_errors": 0, "tx_errors": 0, "crc": 0,
                "rx_bytes": 0, "tx_bytes": 0,
                "rx_rate": 0, "tx_rate": 0,
            }
            continue
        if current is None:
            continue

        # Input/output rates
        m = re.search(r'(\d+) packets input.*?(\d+) bytes', line)
        if m:
            result[current]["rx_bytes"] = int(m.group(2))

        m = re.search(r'(\d+) packets output.*?(\d+) bytes', line)
        if m:
            result[current]["tx_bytes"] = int(m.group(2))

        # Bit rates
        m = re.search(r'(\d+) Kbit/sec.*?(\d+) Kbit/sec', line)
        if m:
            result[current]["rx_rate"] = int(int(m.group(1)) / 1000)
            result[current]["tx_rate"] = int(int(m.group(2)) / 1000)

        # Error counters
        m = re.search(r'(\d+) input errors', line)
        if m:
            result[current]["rx_errors"] = int(m.group(1))

        m = re.search(r'(\d+) output errors', line)
        if m:
            result[current]["tx_errors"] = int(m.group(1))

        m = re.search(r'(\d+) CRC', line)
        if m:
            result[current]["crc"] = int(m.group(1))

    return result

def parse_poe_status(raw: str) -> dict:
    """
    Parse: show power inline
    Interface  Admin  Oper       Power   Device              Class  Max
    Gi1/0/1    auto   on         7.4     Cisco IP Phone      3      30.0
    """
    result = {}
    for line in raw.splitlines():
        m = re.match(r'^(Gi\S+|Te\S+)\s+\S+\s+(\S+)\s+([\d.]+)', line)
        if m:
            iface, oper, watts = m.groups()
            result[iface] = {
                "poe": oper.lower() == "on",
                "poeWatts": float(watts) if oper.lower() == "on" else 0.0,
            }
    return result

def parse_mac_table(raw: str, iface: str) -> list[dict]:
    """
    Parse: show mac address-table interface GiX/Y/Z
    Vlan    Mac Address       Type        Ports
      10    aabb.cc11.2233    DYNAMIC     Gi1/0/1
    """
    entries = []
    for line in raw.splitlines():
        m = re.match(r'\s*(\d+)\s+([0-9a-f.]+)\s+(\S+)\s+(\S+)', line, re.IGNORECASE)
        if m:
            vlan, mac, mtype, port = m.groups()
            entries.append({
                "mac":  mac.replace(".", ":"),   # normalise format
                "vlan": int(vlan),
                "type": mtype.lower(),
            })
    return entries

def parse_uptime(raw: str) -> int:
    """Parse uptime from 'show version' → seconds"""
    m = re.search(r'uptime is (.+)', raw, re.IGNORECASE)
    if not m:
        return 0
    uptime_str = m.group(1)
    seconds = 0
    for val, unit in re.findall(r'(\d+)\s*(year|week|day|hour|minute)', uptime_str):
        val = int(val)
        if "year"   in unit: seconds += val * 365 * 86400
        elif "week" in unit: seconds += val * 7 * 86400
        elif "day"  in unit: seconds += val * 86400
        elif "hour" in unit: seconds += val * 3600
        elif "min"  in unit: seconds += val * 60
    return seconds

def parse_hostname(raw: str) -> str:
    m = re.search(r'^hostname\s+(\S+)', raw, re.MULTILINE)
    return m.group(1) if m else "unknown"

# ═══════════════════════════════════════════════════════════════════════════════
# ASSEMBLER  ─ combine all show output into unified port list
# ═══════════════════════════════════════════════════════════════════════════════

def assemble_ports(outputs: dict) -> list[dict]:
    """Merge all parsed show outputs into a unified port list for the frontend."""
    status_list  = parse_interfaces_status(outputs.get("show interfaces status", ""))
    detail_map   = parse_interfaces_detail(outputs.get("show interfaces", ""))
    poe_map      = parse_poe_status(outputs.get("show power inline", ""))

    ports = []
    for i, p in enumerate(status_list):
        iface = p["id"]
        det   = detail_map.get(iface, {})
        poe   = poe_map.get(iface, {"poe": False, "poeWatts": 0.0})

        # MAC table was fetched per-switch, not per-port (too slow)
        # Frontend can request per-port MAC on demand

        port = {
            "id":          iface,
            "portNum":     i + 1,
            "status":      p["status"],
            "description": p["description"],
            "vlan":        int(p["vlan"]) if str(p["vlan"]).isdigit() else 1,
            "speed":       p["speed"],
            "mode":        "trunk" if str(p["vlan"]).lower() in ("trunk", "routed") else "access",
            "poe":         poe["poe"],
            "poeWatts":    poe["poeWatts"],
            "uptime":      0,    # not available from status cmd; use lastChanged
            "errors": {
                "rx":  det.get("rx_errors", 0),
                "tx":  det.get("tx_errors", 0),
                "crc": det.get("crc", 0),
            },
            "rxBytes":     det.get("rx_bytes", 0),
            "txBytes":     det.get("tx_bytes", 0),
            "rxRate":      det.get("rx_rate", 0),
            "txRate":      det.get("tx_rate", 0),
            "macTable":    [],
            "lastChanged": datetime.utcnow().isoformat(),
            "lastSeen":    datetime.utcnow().isoformat() if p["status"] == "up" else None,
            "isUnused":    False,
            "unusedSince": None,
            "events":      [{"timestamp": int(time.time() * 1000), "event": p["status"]}],
        }
        ports.append(port)
    return ports

# ═══════════════════════════════════════════════════════════════════════════════
# API ROUTES
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/api/switches")
def list_switches():
    """Return the switch inventory list."""
    switches = load_switches()
    # Add reachability status from cache if available
    result = []
    for sw in switches:
        cached = cache_get(f"status:{sw['host']}")
        result.append({
            **sw,
            "reachable": cached.get("reachable") if cached else None,
            "lastPolled": cached.get("lastPolled") if cached else None,
            "portCount":  cached.get("portCount") if cached else None,
            "portsUp":    cached.get("portsUp") if cached else None,
        })
    return result


@app.get("/api/switches/{host}/ports")
def get_switch_ports(host: str):
    """
    Pull live port data from a switch via SSH.
    Results are cached for CACHE_TTL seconds.
    """
    # Check cache first
    cached = cache_get(f"ports:{host}")
    if cached:
        return {"source": "cache", "cachedAt": cached["cachedAt"], "ports": cached["ports"], "sysinfo": cached.get("sysinfo", {})}

    if not NETMIKO_AVAILABLE:
        raise HTTPException(503, "netmiko not installed — run: pip install netmiko")

    # Verify host is in our inventory (security: don't allow arbitrary hosts)
    switches = load_switches()
    if not any(sw["host"] == host for sw in switches):
        raise HTTPException(404, f"Switch {host} not in inventory")

    try:
        outputs = run_show_multi(host, [
            "show interfaces status",
            "show interfaces",
            "show power inline",
            "show version",
        ])
    except NetmikoAuthenticationException:
        raise HTTPException(401, "SSH authentication failed — check credentials")
    except NetmikoTimeoutException:
        raise HTTPException(504, f"Timeout connecting to {host}")
    except Exception as e:
        raise HTTPException(502, f"SSH error: {str(e)}")

    ports    = assemble_ports(outputs)
    sysinfo  = {
        "uptime":   parse_uptime(outputs.get("show version", "")),
        "hostname": parse_hostname(outputs.get("show version", "")),
    }

    payload = {
        "ports":     ports,
        "sysinfo":   sysinfo,
        "cachedAt":  datetime.utcnow().isoformat(),
    }
    cache_set(f"ports:{host}", payload)
    cache_set(f"status:{host}", {
        "reachable":  True,
        "lastPolled": datetime.utcnow().isoformat(),
        "portCount":  len(ports),
        "portsUp":    sum(1 for p in ports if p["status"] == "up"),
    })

    return {"source": "live", **payload}


@app.get("/api/switches/{host}/ports/{port_id}/mac")
def get_port_mac(host: str, port_id: str):
    """Fetch MAC address table for a single port on demand."""
    switches = load_switches()
    if not any(sw["host"] == host for sw in switches):
        raise HTTPException(404, f"Switch {host} not in inventory")

    if not NETMIKO_AVAILABLE:
        return {"macTable": []}

    try:
        raw = run_show(host, f"show mac address-table interface {port_id}")
        return {"macTable": parse_mac_table(raw, port_id)}
    except Exception as e:
        raise HTTPException(502, f"SSH error: {str(e)}")


@app.post("/api/switches/{host}/refresh")
def force_refresh(host: str):
    """Invalidate cache and force a fresh SSH poll."""
    _cache.pop(f"ports:{host}", None)
    _cache.pop(f"status:{host}", None)
    return {"message": f"Cache cleared for {host} — next request will poll live"}


@app.get("/api/switches/{host}/ping")
def ping_switch(host: str):
    """Quick reachability check — just open SSH and close."""
    switches = load_switches()
    if not any(sw["host"] == host for sw in switches):
        raise HTTPException(404, f"Switch {host} not in inventory")
    if not NETMIKO_AVAILABLE:
        return {"reachable": False, "reason": "netmiko not installed"}
    try:
        with ssh_connect(host) as conn:
            hostname = conn.find_prompt().replace("#", "").replace(">", "").strip()
        return {"reachable": True, "hostname": hostname}
    except NetmikoAuthenticationException:
        return {"reachable": False, "reason": "auth_failed"}
    except NetmikoTimeoutException:
        return {"reachable": False, "reason": "timeout"}
    except Exception as e:
        return {"reachable": False, "reason": str(e)}


@app.get("/api/switches/list/inventory")
def get_inventory():
    """Return the raw switches.json inventory file."""
    return load_switches()


@app.post("/api/switches/list/inventory")
def update_inventory(switches: list):
    """Update the switches.json inventory."""
    SWITCHES_FILE.write_text(json.dumps(switches, indent=2))
    return {"message": f"Saved {len(switches)} switches"}


@app.get("/health")
def health():
    return {"status": "ok", "netmiko": NETMIKO_AVAILABLE, "cachedHosts": len(_cache)}
