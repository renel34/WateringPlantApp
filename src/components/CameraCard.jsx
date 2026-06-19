import { useState, useEffect } from "react";

const CAMERA_URL  = import.meta.env.VITE_CAMERA_URL;
const PI_BASE_URL = import.meta.env.DEV ? "" : import.meta.env.VITE_PI_BASE_URL;

function CameraCard() {
  // currentTime is driven by the Pi's clock, not the browser's.
  // We sync with the Pi every 30s and tick locally in between for a smooth clock.
  const [currentTime, setCurrentTime] = useState(null);
  const [streamError, setStreamError] = useState(false);

  // ── Sync with Pi's actual clock ────────────────────────────────────────────
  useEffect(() => {
    const syncWithPi = async () => {
      try {
        const res  = await fetch(`${PI_BASE_URL}/api/status`);
        const data = await res.json();
        if (data.server_time) {
          setCurrentTime(new Date(data.server_time));
        }
      } catch (err) {
        console.error("Failed to sync Pi time:", err);
      }
    };

    syncWithPi();
    const syncInterval = setInterval(syncWithPi, 30000); // resync every 30s
    return () => clearInterval(syncInterval);
  }, []);

  // ── Tick locally every second between syncs ────────────────────────────────
  useEffect(() => {
    const tick = setInterval(() => {
      setCurrentTime((prev) => (prev ? new Date(prev.getTime() + 1000) : prev));
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const formatDateTime = (date) => {
    const time = date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const dateStr = date.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
    return `${time} - ${dateStr}`;
  };

  return (
    <div className="rounded-3xl border-2 border-green-200 overflow-hidden shadow-md bg-white">
      <div className="relative">
        {streamError ? (
          <div className="w-full h-105 md:h-125 xl:h-245 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-400 text-lg">Camera unavailable</p>
          </div>
        ) : (
          <img
            src={CAMERA_URL}
            alt="Live plant camera feed"
            className="w-full h-105 md:h-125 xl:h-245 xl:w-full object-cover"
            onError={() => setStreamError(true)}
          />
        )}
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-[#e7ede4]/90 px-3 py-2 md:px-4 md:py-3 rounded-md shadow-sm">
          <p className="text-2xl md:text-3xl font-medium text-gray-800">
            Live Camera Feed
          </p>
          <p className="text-base md:text-lg text-gray-700">
            {currentTime ? formatDateTime(currentTime) : "Syncing time..."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CameraCard;
