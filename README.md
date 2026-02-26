# 🖥️ Cisco Catalyst 9300 — Live SSH Monitor

A full-stack web portal that connects to your real Cisco switches via SSH (Netmiko),
pulls live port data, and displays it in the visual switch simulator UI.

**Read-only by design** — only `show` commands are ever sent.  
The backend has a hard-coded guard that rejects any non-`show` command.

---

## Architecture

```
Browser (React)
     │  HTTP/JSON
     ▼
FastAPI Backend (Python)        ← runs on your internal server
     │  SSH via Netmiko
     ▼
Cisco Catalyst 9300 Switches    ← your real switches
```

---

## Quick Start

### 1 — Set up read-only user on each switch

Log into each switch and run the commands in `backend/readonly-user-setup.ios`.
The key command is:

```
username readonly privilege 1 secret YOUR_PASSWORD
```

Privilege level 1 = show commands only. Cannot enter config mode.

---

### 2 — Configure your switch inventory

Edit `backend/switches.json`:

```json
[
  { "name": "SW-CORE-01",   "host": "192.168.1.1",  "location": "Server Room A", "model": "C9300-48P" },
  { "name": "SW-FLOOR-2",   "host": "192.168.1.2",  "location": "Floor 2",       "model": "C9300-48P" },
  { "name": "SW-FLOOR-3",   "host": "192.168.1.3",  "location": "Floor 3",       "model": "C9300-48T" }
]
```

Add as many switches as you have.

---

### 3 — Configure credentials

Edit `backend/.env`:

```env
SWITCH_USER=readonly
SWITCH_PASS=your_readonly_password_here
SWITCH_SECRET=your_enable_secret_if_needed
SWITCH_PORT=22
SWITCH_TIMEOUT=15
```

All switches share the same credentials (as requested).

---

### 4 — Install and run the backend

```bash
cd backend

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Load .env and start
export $(cat .env | xargs)      # Windows: set each variable manually
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend runs at: http://localhost:8000  
API docs (auto-generated): http://localhost:8000/docs

---

### 5 — Install and run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

### 6 — Deploy to a server (production)

**Backend (run as a service):**
```bash
# Install as systemd service — create /etc/systemd/system/cisco-monitor.service
[Unit]
Description=Cisco Switch Monitor API
After=network.target

[Service]
WorkingDirectory=/opt/cisco-monitor/backend
Environment=SWITCH_USER=readonly
Environment=SWITCH_PASS=your_password
ExecStart=/opt/cisco-monitor/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

**Frontend (build and serve via nginx):**
```bash
cd frontend

# Set your server's IP/hostname
echo "VITE_API_URL=http://YOUR_SERVER_IP:8000" > .env

npm run build
# dist/ folder → serve with nginx, Apache, or Vercel
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/switches` | List all switches with cached status |
| GET | `/api/switches/{host}/ports` | Get all port data (SSH or cache) |
| GET | `/api/switches/{host}/ports/{port}/mac` | Fetch MAC table for one port |
| POST | `/api/switches/{host}/refresh` | Force cache invalidation |
| GET | `/api/switches/{host}/ping` | Quick reachability check |
| GET | `/health` | Health check + netmiko status |

---

## What data is pulled from each switch

| Show Command | Data extracted |
|---|---|
| `show interfaces status` | Port name, status, VLAN, speed, duplex |
| `show interfaces` | RX/TX bytes, error counters, bit rates |
| `show power inline` | PoE status, watts consumed per port |
| `show version` | Switch uptime, hostname |
| `show mac address-table interface X` | MAC addresses (per-port, on demand) |

---

## Security notes

- Only `show` commands are sent — enforced in `main.py` with a guard that raises an error for any command not starting with `show`
- The backend only connects to hosts listed in `switches.json` — arbitrary IPs are rejected
- SSH credentials live in `.env` — never commit this file
- Use `privilege 1` on the switch user — this is enforced at the IOS level, not just by this app
- The app never stores credentials in the frontend or browser

---

## Caching

SSH connections take 3–10 seconds per switch. Results are cached for **60 seconds** by default.

Change in `main.py`:
```python
CACHE_TTL = 60  # seconds
```

The UI shows whether data is **● LIVE** or **● CACHED** with a timestamp.
Click **↻ REFRESH** to force a new SSH connection.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `netmiko not installed` | `pip install netmiko` |
| `SSH authentication failed` | Check SWITCH_USER / SWITCH_PASS in .env |
| `Timeout connecting` | Check IP is reachable, SSH enabled on switch (`ip ssh version 2`) |
| `Switch not in inventory` | Add the host to switches.json |
| No PoE data | Switch may not have PoE — `show power inline` returns empty |
| Ports show as "down" incorrectly | Check `show interfaces status` output format matches parser |

---

## File structure

```
cisco-live/
├── backend/
│   ├── main.py                  ← FastAPI + Netmiko SSH backend
│   ├── switches.json            ← Your switch inventory
│   ├── requirements.txt
│   ├── .env                     ← SSH credentials (never commit!)
│   └── readonly-user-setup.ios  ← Cisco config commands for read-only user
└── frontend/
    ├── src/
    │   ├── App.jsx              ← Full React UI with switch search
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── .env                     ← VITE_API_URL setting
```
