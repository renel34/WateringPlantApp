# Remote Plant Watering System

A full-stack IoT application that lets you monitor soil moisture, dispense water remotely, and watch your plant grow — all from a web browser, powered by a Raspberry Pi 5.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-Python-000000?logo=flask&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)
![Raspberry Pi](https://img.shields.io/badge/Raspberry%20Pi-5-A22846?logo=raspberrypi&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Description

The Remote Plant Watering System is a web-controlled IoT device that automates and monitors plant care. A capacitive soil moisture sensor reports real-time hydration levels, a peristaltic pump dispenses precise amounts of water on demand, and a live camera feed lets you watch it happen — all accessible from any device on the network through a responsive React interface.

The system enforces per-plant daily watering limits, tracks historical watering data in PostgreSQL, and provides live visual feedback while the pump is running.

---

## Overview

This project bridges hardware and software: a Raspberry Pi 5 reads sensor data and drives a pump through GPIO, while a Flask REST API exposes that hardware to a React front end over the network. Every watering event is logged to a PostgreSQL database, broken down by plant type, so the system can prevent overwatering and display weekly trends per plant.

The frontend and backend are fully decoupled — the React app communicates with the Pi exclusively through a documented REST API, making the hardware layer swappable without touching the UI.

---

## Features

- **Live soil moisture readings** updated continuously from a capacitive sensor
- **On-demand watering** with an adjustable slider for precise ml control
- **Plant-type aware daily limits** — each plant type (succulent, herb, leafy vegetable, flowering, tropical, woody, general) has its own daily watering cap, enforced independently
- **Live progress animation** — the dispensed-water counter and progress bar animate in real time while the pump runs, not just after it finishes
- **Weekly watering history chart**, filtered per plant type
- **Live camera feed** of the plant and mechanism, synced to the Raspberry Pi's actual clock
- **Daily limit protection** — the system blocks watering once a plant's daily allowance is reached, with clear in-app messaging
- **Fully responsive design** — works cleanly from mobile to desktop

---

## Technologies Used

**Frontend**

- React 19 + Vite
- Tailwind CSS
- Custom hooks for live polling and progress interpolation

**Backend**

- Python 3 + Flask
- Flask-CORS
- psycopg2 (PostgreSQL driver)
- python-dotenv

**Database**

- PostgreSQL

**Hardware / IoT**

- Raspberry Pi 5 (4GB)
- Capacitive soil moisture sensor (analog, 0–3V) + ADS1115 16-bit ADC (I²C)
- 12V DC peristaltic dosing pump
- Keyes MOS module (IRLZ44N logic-level MOSFET) for PWM pump control
- Raspberry Pi Camera Module V2 NoIR
- go2rtc — camera streaming server

**Infrastructure**

- Nginx — static file serving and reverse proxy
- PM2 — Node/Python process management and auto-restart
- Git / GitHub — version control

---

## Skills Demonstrated

- Full-stack web development (React + Flask REST API)
- Hardware-software interfacing: GPIO control, PWM signal generation, I²C communication
- Electronics debugging: logic-level mismatches, MOSFET selection, calibration methodology
- Relational database design and query optimization (per-plant, per-day aggregation)
- Real-time UI patterns: polling, optimistic local state interpolation, live progress animation
- RESTful API design with clear contracts between frontend and hardware backend
- Linux server administration: process management (PM2), reverse proxying (Nginx), user permissions/groups
- Responsive, accessible UI design with Tailwind CSS
- Git-based deployment workflow across two environments (development PC → Raspberry Pi production)

---

## Architecture

```
┌─────────────────────┐         HTTP/REST           ┌──────────────────────┐
│   React Web App     │ ◄─────────────────────────► │   Flask API (3004)   │
│  (Nginx, port 3006) │                             │   on Raspberry Pi 5  │
└─────────────────────┘                             └──────────┬───────────┘
                                                               │
                               ┌───────────────────────────────┼───────────────────────┐
                               │                               │                       │
                      ┌────────▼────────┐          ┌───────────▼─────────┐   ┌─────────▼──────────┐
                      │  ADS1115 ADC    │          │  IRLZ44N MOSFET     │   │   PostgreSQL       │
                      │  + Moisture     │          │  + Peristaltic Pump │   │   (plantdb)        │
                      │  Sensor (I²C)   │          │  (PWM via GPIO 18)  │   │   watering_history │
                      └─────────────────┘          └─────────────────────┘   └────────────────────┘

┌───────────────────────┐        MJPEG stream        ┌──────────────────────┐
│   React Camera Card   │ ◄───────────────────────── │   go2rtc (port 8080) │
└───────────────────────┘                            │   + Camera Module V2 │
                                                     └──────────────────────┘
```

All processes (`plant` Flask API, `plant-camera` go2rtc) run under PM2 alongside the rest of the Pi's hosted applications, with Nginx serving the built React app as static files.

---

## Project Structure

```
remote-plant-watering-system/
├── frontend/                      # React application (this repo)
│   ├── src/
│   │   ├── components/
│   │   │   ├── App.jsx              # Main app — state, polling, watering logic
│   │   │   ├── CameraCard.jsx       # Live camera feed + Pi-synced clock
│   │   │   ├── StatsSection.jsx     # Moisture & water dispensed cards
│   │   │   ├── PlantSelector.jsx    # Plant type dropdown + daily limit info
│   │   │   ├── WaterAmountSlider.jsx# Adjustable ml slider + message banner
│   │   │   ├── WeeklyHistoryChart.jsx
│   │   │   └── plantSettings.js     # Per-plant daily limits & metadata
│   │   └── main.jsx
│   ├── .env                         # VITE_PI_BASE_URL, VITE_CAMERA_URL (not committed)
│   ├── vite.config.js               # Dev proxy to Pi API
│   └── package.json
│
└── backend/                       # Flask API (deployed to Raspberry Pi 5)
    ├── server.py                    # REST API endpoints
    ├── hardware.py                  # GPIO, sensor, and pump control
    ├── history.py                   # PostgreSQL data access layer
    ├── start.sh                     # PM2 launch script
    ├── requirements.txt
    └── .env                         # PORT, DB credentials (not committed)
```

---

## Installation

### Prerequisites

- Raspberry Pi 5 running Raspberry Pi OS (Bookworm or later)
- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL 14+
- PM2 (`npm install -g pm2`)
- Nginx

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/remote-plant-watering-system.git
cd remote-plant-watering-system
```

### 2. Frontend setup (development machine)

```bash
cd frontend
npm install
cp .env.example .env   # fill in VITE_PI_BASE_URL and VITE_CAMERA_URL
npm run dev
```

### 3. Backend setup (Raspberry Pi 5)

```bash
cd backend
pip install -r requirements.txt --break-system-packages
cp .env.example .env   # fill in PORT and PostgreSQL credentials
```

Add your user to the `gpio` and `i2c` groups so Flask can access hardware without `sudo`:

```bash
sudo usermod -a -G gpio,i2c $USER
sudo reboot
```

### 4. Database setup

See [Database](#-database) below for the schema.

### 5. Run with PM2

```bash
pm2 start start.sh --name "plant"
pm2 start "go2rtc" --name "plant-camera"
pm2 save
```

### 6. Build and deploy the frontend

```bash
cd frontend
npm run build
```

Serve the resulting `dist/` folder with Nginx (see `nginx.conf` example in `/docs`).

---

## Database

PostgreSQL database: `plantdb`

```sql
CREATE TABLE watering_history (
    id SERIAL PRIMARY KEY,
    event_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    plant_type VARCHAR(20),
    moisture_before NUMERIC(5,1),
    water_requested_ml NUMERIC(8,1),
    water_dispensed_ml NUMERIC(8,1)
);
```

Each watering event is recorded individually, tagged with its `plant_type`, allowing daily totals and weekly history to be calculated independently per plant rather than as one combined total.

---

## API Integration

The Flask backend exposes a small REST API consumed entirely by the React frontend.

| Method | Endpoint                         | Description                                                                                             |
| ------ | -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `GET`  | `/api/status?plant_type=<type>`  | Live moisture %, today's dispensed total for the given plant, pump state, and Pi server time            |
| `POST` | `/api/water`                     | Dispense water — body: `{ ml, speed_percent, plant_type }`. Enforces per-plant daily limits server-side |
| `POST` | `/api/pump`                      | Manual pump speed override — body: `{ speed_percent }`                                                  |
| `GET`  | `/api/history?plant_type=<type>` | Last 7 days of watering totals for the given plant                                                      |
| `GET`  | `/api/remaining/<plant_type>`    | Remaining ml allowed today for a given plant type                                                       |
| `GET`  | `/api/events`                    | Last 10 watering events with full detail                                                                |

Live camera stream (separate from the REST API, served by go2rtc):

```
GET http://<pi-ip>:8080/api/stream.mjpeg?src=plant
```

---

## How It Works

1. The React app polls `/api/status` every 10 seconds to keep moisture and dispensed totals current, filtered to whichever plant is currently selected.
2. Selecting a plant type triggers fresh fetches of that plant's remaining daily allowance, dispensed total, and weekly history — each plant tracks independently.
3. Clicking **Water Plant** sends the requested ml and plant type to the Pi. The backend checks PostgreSQL for today's total against that plant's daily limit before allowing the pump to run.
4. If approved, the Pi drives the peristaltic pump via PWM through an IRLZ44N MOSFET for a calibrated duration, while the moisture sensor is read beforehand for historical context.
5. Because the pump call blocks synchronously on the Pi, the React app interpolates a live progress animation locally — climbing smoothly from the plant's existing daily total toward the new target — then reconciles with the real database value once the pump finishes.
6. Every event is recorded in PostgreSQL with plant type, requested/dispensed volume, and pre-watering moisture level.
7. The live camera feed streams continuously via go2rtc, with its on-screen clock synced to the Pi's own system time rather than the viewer's device.

---

## Challenges Solved

- **Raspberry Pi 5 GPIO compatibility** — early versions of `RPi.GPIO` couldn't address the Pi 5's new RP1 chip ("Cannot determine SOC peripheral base address"). Resolved by ensuring the system-installed `RPi.GPIO` 0.7.2 took precedence over an outdated user-installed copy.
- **MOSFET logic-level mismatch** — the original IRF520 module required ~5V on the gate to fully switch, but the Pi 5 only outputs 3.3V, leaving the pump under-powered. Solved by swapping the IRF520 for a true logic-level IRLZ44N MOSFET.
- **PM2 + GPIO permissions** — running Flask under PM2 with `sudo` failed silently (PM2 can't supply an interactive password). Resolved by adding the service user to the `gpio` and `i2c` groups, removing the need for `sudo` entirely.
- **Pi 5 camera streaming** — mjpg-streamer's UVC plugin couldn't access the Pi 5's new `rp1-cfe` camera driver. Solved by switching to go2rtc, which interfaces directly with `rpicam-vid`.
- **Per-plant daily limits** — an early version tracked only a single daily total across all plants, allowing the limit to be bypassed by switching plant types. Fixed by tagging every database row with `plant_type` and filtering all aggregate queries accordingly.
- **Live progress feedback** — since the pump command blocks until completion, the dispensed-water total only updated in the database after the fact. Solved with a client-side interpolation that animates progress in real time, then reconciles with the authoritative database value.
- **Pump flow-rate drift** — measured flow rate changed between calibration sessions as tubing settled. Addressed with a repeatable calibration procedure (run pump to a fixed known volume, measure elapsed time) rather than relying on datasheet specs.

---

## What I Learned

- How to safely interface a Raspberry Pi's GPIO with real-world electronics, including the importance of logic-level compatibility between microcontrollers and MOSFETs
- Practical calibration techniques for translating PWM duty cycle into physical, real-world units (ml)
- Designing a REST API around what hardware can realistically provide, rather than forcing hardware to match a predefined contract
- Structuring PostgreSQL queries for accurate per-category daily aggregation
- Managing the gap between backend state (blocking hardware calls) and responsive frontend UX through local interpolation
- Deploying and managing multiple independent services on a single Raspberry Pi using PM2 and Nginx
- Debugging real hardware systematically — isolating whether a fault lies in software, wiring, or component selection

---

## Author

**René Laplante**
Full-stack developer & IoT enthusiast

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
