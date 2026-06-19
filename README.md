Remote Plant Watering System
A React-based web application for remotely monitoring and controlling an automated plant watering system powered by a Raspberry Pi.
Features
Live Camera Feed: Real-time video stream of your plant with synchronized timestamp
Soil Moisture Monitoring: Track current soil moisture levels in real-time
Smart Watering Control: Dispense precise amounts of water with daily limits per plant type
Multiple Plant Profiles: Pre-configured settings for different plant types (succulents, herbs, vegetables, etc.)
Weekly History Chart: Visual representation of water dispensed over the past 7 days
Daily Limit Protection: Prevents overwatering with configurable daily maximum amounts
Responsive Design: Works seamlessly on mobile, tablet, and desktop devices
Screenshots
Dashboard Overview
Main dashboard showing live camera feed, moisture levels, and watering controls
Tech Stack
Frontend: React 19, Vite
Styling: Tailwind CSS 4
Charts: Chart.js with React Chart.js 2
Icons: Lucide React, React Icons
Backend: Raspberry Pi with Python Flask API (separate repository)
Prerequisites
Node.js 18+ and npm
Raspberry Pi with camera module and moisture sensor
Backend API running on Raspberry Pi ([link to backend repo if available])
Installation

1.  Clone the repository:
    bash
    git clone https://github.com/yourusername/watering-plant-app.git
    cd watering-plant-app
2.  Install dependencies:
    bash
    npm install
3.  Create a .env file in the root directory:
    VITE_CAMERA_URL=http://your-pi-ip:8000/stream
    VITE_PI_BASE_URL=http://your-pi-ip:5000
4.  Start the development server:
    bash
    npm run dev
5.  Open your browser to http://localhost:5173
    Environment Variables
    Variable Description Example
    VITE_CAMERA_URL URL for the camera stream endpoint http://192.168.1.100:8000/stream
    VITE_PI_BASE_URL Base URL for the Raspberry Pi API http://192.168.1.100:5000
    Building for Production
    bash
    npm run build
    The built files will be in the dist directory, ready to be deployed to your Raspberry Pi or any static hosting service.
    API Endpoints
    The app expects the following endpoints from the Raspberry Pi backend:
    GET /api/status?plant_type={type} - Current moisture level, dispensed amount, and watering status
    GET /api/history?plant_type={type} - Weekly watering history
    GET /api/remaining/{plant_type} - Remaining water allowance for the day
    POST /api/water - Trigger watering with specified amount and plant type
    Plant Types
    The system supports the following pre-configured plant profiles:
    General (200ml/day)
    Succulent (50ml/day)
    Herb (150ml/day)
    Vegetable (300ml/day)
    Flower (250ml/day)
    Fern (200ml/day)
    Each profile has customized daily water limits to prevent overwatering.
    Project Structure
    watering-app/
    ├── src/
    │ ├── components/
    │ │ ├── App.jsx # Main application component
    │ │ ├── CameraCard.jsx # Live camera feed display
    │ │ ├── StatsSection.jsx # Moisture and dispensed water stats
    │ │ ├── PlantSelector.jsx # Plant type selection dropdown
    │ │ ├── WaterAmountSlider.jsx # Water amount control
    │ │ ├── WeeklyHistoryChart.jsx # 7-day history chart
    │ │ └── plantSettings.js # Plant profile configurations
    │ ├── main.jsx # Application entry point
    │ └── index.css # Global styles
    ├── .env # Environment variables (not in repo)
    ├── vite.config.js # Vite configuration
    ├── tailwind.config.js # Tailwind CSS configuration
    └── package.json # Project dependencies
    Development
    bash

# Run development server

npm run dev

# Run linter

npm run lint

# Build for production

npm run build

# Preview production build

npm run preview
Features in Detail
Smart Daily Limits
Each plant type has a configured daily maximum water amount
The system tracks water dispensed in the last 24 hours
Prevents accidental overwatering by blocking requests that exceed limits
Visual progress bar shows how much of the daily allowance has been used
Real-time Synchronization
Camera feed timestamp syncs with Raspberry Pi clock every 30 seconds
Moisture levels update every 10 seconds
Faster polling (every 2 seconds) during active watering
Automatic history refresh after watering completes
Responsive Design
Mobile-first approach with Tailwind CSS
Adaptive layouts for phone, tablet, and desktop
Touch-friendly controls for mobile devices
Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
License
This project is licensed under the MIT License - see the LICENSE file for details.
Author
René Laplante
Acknowledgments
Built with React and Vite for fast development
Styled with Tailwind CSS for modern UI
Charts powered by Chart.js
Support
For issues, questions, or suggestions, please open an issue on GitHub.
Note: This is the frontend application only. You'll need the corresponding Raspberry Pi backend with camera, moisture sensor, and water pump control to use this system.

Does the README.md file use a special formatting? I yes, could you format this document like it?
Yes! README.md files use Markdown formatting. Here's the properly formatted version:

# Remote Plant Watering System

A React-based web application for remotely monitoring and controlling an automated plant watering system powered by a Raspberry Pi.

## Features

- **Live Camera Feed**: Real-time video stream of your plant with synchronized timestamp
- **Soil Moisture Monitoring**: Track current soil moisture levels in real-time
- **Smart Watering Control**: Dispense precise amounts of water with daily limits per plant type
- **Multiple Plant Profiles**: Pre-configured settings for different plant types (succulents, herbs, vegetables, etc.)
- **Weekly History Chart**: Visual representation of water dispensed over the past 7 days
- **Daily Limit Protection**: Prevents overwatering with configurable daily maximum amounts
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices

## Screenshots

![Dashboard Overview](./screenshots/dashboard.png)
_Main dashboard showing live camera feed, moisture levels, and watering controls_

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS 4
- **Charts**: Chart.js with React Chart.js 2
- **Icons**: Lucide React, React Icons
- **Backend**: Raspberry Pi with Python Flask API (separate repository)

## Prerequisites

- Node.js 18+ and npm
- Raspberry Pi with camera module and moisture sensor
- Backend API running on Raspberry Pi ([link to backend repo if available])

## Installation

1. Clone the repository:

````bash
git clone https://github.com/yourusername/watering-plant-app.git
cd watering-plant-app
2.
Install dependencies:
bash
npm install
3.
Create a .env file in the root directory:
VITE_CAMERA_URL=http://your-pi-ip:8000/stream
VITE_PI_BASE_URL=http://your-pi-ip:5000
4.
Start the development server:
bash
npm run dev
5.
Open your browser to http://localhost:5173
Environment Variables
Variable	Description	Example
VITE_CAMERA_URL	URL for the camera stream endpoint	http://192.168.1.100:8000/stream
VITE_PI_BASE_URL	Base URL for the Raspberry Pi API	http://192.168.1.100:5000
Building for Production
bash
npm run build
The built files will be in the dist directory, ready to be deployed to your Raspberry Pi or any static hosting service.
API Endpoints
The app expects the following endpoints from the Raspberry Pi backend:
GET /api/status?plant_type={type} - Current moisture level, dispensed amount, and watering status
GET /api/history?plant_type={type} - Weekly watering history
GET /api/remaining/{plant_type} - Remaining water allowance for the day
POST /api/water - Trigger watering with specified amount and plant type
Plant Types
The system supports the following pre-configured plant profiles:
General (200ml/day)
Succulent (50ml/day)
Herb (150ml/day)
Vegetable (300ml/day)
Flower (250ml/day)
Fern (200ml/day)
Each profile has customized daily water limits to prevent overwatering.
Project Structure
watering-app/
├── src/
│   ├── components/
│   │   ├── App.jsx              # Main application component
│   │   ├── CameraCard.jsx       # Live camera feed display
│   │   ├── StatsSection.jsx     # Moisture and dispensed water stats
│   │   ├── PlantSelector.jsx    # Plant type selection dropdown
│   │   ├── WaterAmountSlider.jsx # Water amount control
│   │   ├── WeeklyHistoryChart.jsx # 7-day history chart
│   │   └── plantSettings.js     # Plant profile configurations
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles
├── .env                         # Environment variables (not in repo)
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── package.json                # Project dependencies
Development
bash
# Run development server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
Features in Detail
Smart Daily Limits
Each plant type has a configured daily maximum water amount
The system tracks water dispensed in the last 24 hours
Prevents accidental overwatering by blocking requests that exceed limits
Visual progress bar shows how much of the daily allowance has been used
Real-time Synchronization
Camera feed timestamp syncs with Raspberry Pi clock every 30 seconds
Moisture levels update every 10 seconds
Faster polling (every 2 seconds) during active watering
Automatic history refresh after watering completes
Responsive Design
Mobile-first approach with Tailwind CSS
Adaptive layouts for phone, tablet, and desktop
Touch-friendly controls for mobile devices
Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
License
This project is licensed under the MIT License - see the LICENSE file for details.
Author
René Laplante
Acknowledgments
Built with React and Vite for fast development
Styled with Tailwind CSS for modern UI
Charts powered by Chart.js
Support
For issues, questions, or suggestions, please open an issue on GitHub.
Note: This is the frontend application only. You'll need the corresponding Raspberry Pi backend with camera, moisture sensor, and water pump control to use this system.

The key Markdown formatting elements used:

- `#` for headings (# = h1, ## = h2, ### = h3, etc.)
- `**text**` for bold
- `*text*` for italic
- `` `code` `` for inline code
- ` ```language ` for code blocks
- `- ` for bullet lists
- `1. ` for numbered lists
- `| | |` for tables
- `[text](url)` for links
- `![alt](image-url)` for images
- `---` for horizontal rules

Just save this as `README.md` in your project root and it will display beautifully on GitHub!
Workspace indexing: Done
Current file

Workspace

Add scope
````
