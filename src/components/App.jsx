import WaterAmountSlider from "./WaterAmountSlider";
import StatsSection from "./StatsSection";
import WeeklyHistoryChart from "./WeeklyHistoryChart";
import { useState, useEffect, useCallback, useRef } from "react";
import CameraCard from "./CameraCard";
import plantSettings from "./plantSettings";
import PlantSelector from "./PlantSelector";

const PI_BASE_URL = import.meta.env.DEV ? "" : import.meta.env.VITE_PI_BASE_URL;

function App() {
  const [selectedPlant, setSelectedPlant] = useState("general");
  const [dailyMax, setDailyMax]           = useState(plantSettings["general"].defaultMlPerDay);
  const [waterAmount, setWaterAmount]     = useState(plantSettings["general"].defaultMlPerDay);
  const [isWatering, setIsWatering]       = useState(false);

  // ── Live sensor data ───────────────────────────────────────────────────────
  const [moisturePercent, setMoisturePercent]   = useState(null);
  const [dispensedTodayMl, setDispensedTodayMl] = useState(0); // authoritative value from the Pi/DB
  const [displayedMl, setDisplayedMl]           = useState(0); // what the Water Dispensed card actually shows
  const [remainingMl, setRemainingMl]           = useState(plantSettings["general"].defaultMlPerDay);
  const [weeklyData, setWeeklyData]             = useState([0, 0, 0, 0, 0, 0, 0]);
  const [days, setDays]                         = useState(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);

  // ── Message banner ─────────────────────────────────────────────────────────
  const [wateringMessage, setWateringMessage] = useState(null);

  // ── Tracks whether a live progress animation is currently driving displayedMl ──
  // While true, fetchStatus updates moisture/is_watering but NOT displayedMl,
  // so the live progress animation isn't interrupted by stale DB reads.
  const sessionActiveRef = useRef(false);

  // ── Fetch live status — filtered by current plant type ────────────────────
  const fetchStatus = useCallback(async (plantType) => {
    try {
      const res  = await fetch(`${PI_BASE_URL}/api/status?plant_type=${plantType}`);
      const data = await res.json();
      setMoisturePercent(data.moisture_percent);
      setDispensedTodayMl(data.dispensed_today_ml);
      setIsWatering(data.is_watering);
      if (!sessionActiveRef.current) {
        setDisplayedMl(data.dispensed_today_ml);
      }
    } catch (err) {
      console.error("Failed to fetch status:", err);
    }
  }, []);

  // ── Fetch weekly history — filtered by current plant type ─────────────────
  const fetchHistory = useCallback(async (plantType) => {
    try {
      const res  = await fetch(`${PI_BASE_URL}/api/history?plant_type=${plantType}`);
      const data = await res.json();
      setWeeklyData(data.amounts_ml);
      setDays(data.days);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  }, []);

  // ── Fetch remaining water for selected plant ───────────────────────────────
  const fetchRemaining = useCallback(async (plantType) => {
    try {
      const res  = await fetch(`${PI_BASE_URL}/api/remaining/${plantType}`);
      const data = await res.json();
      setRemainingMl(data.remaining_ml);
      if (data.remaining_ml <= 0) {
        setWateringMessage({
          type: "warning",
          text: `Daily limit of ${data.limit_ml} ml already reached for ${plantSettings[plantType].label} today.`
        });
      } else {
        setWateringMessage(null);
      }
    } catch (err) {
      console.error("Failed to fetch remaining:", err);
    }
  }, []);

  // ── On mount: fetch everything, then poll status every 10s ────────────────
  useEffect(() => {
    fetchStatus("general");
    fetchHistory("general");
    fetchRemaining("general");
    const interval = setInterval(() => fetchStatus(selectedPlant), 10000);
    return () => clearInterval(interval);
  }, []);

  // ── When plant changes: reset water amount, refresh status/remaining/history ──
  useEffect(() => {
    const newMax = plantSettings[selectedPlant].defaultMlPerDay;
    setDailyMax(newMax);
    fetchStatus(selectedPlant);
    fetchHistory(selectedPlant);
    fetchRemaining(selectedPlant);
    setWateringMessage(null);
  }, [selectedPlant]);

  // ── Reset water amount whenever remaining changes (after fetchRemaining) ──
  useEffect(() => {
    setWaterAmount(Math.min(dailyMax, remainingMl));
  }, [remainingMl, dailyMax]);

  // ── Send watering command to Pi ────────────────────────────────────────────
  const handleWaterPlant = async () => {
    if (isWatering) return;
    setWateringMessage(null);

    // Client-side pre-check
    if (remainingMl <= 0) {
      setWateringMessage({
        type: "warning",
        text: `Daily limit of ${dailyMax} ml already reached for ${plantSettings[selectedPlant].label} today.`
      });
      return;
    }

    if (waterAmount > remainingMl) {
      setWateringMessage({
        type: "warning",
        text: `Only ${remainingMl} ml remaining today for ${plantSettings[selectedPlant].label}. Reduce the water amount.`
      });
      return;
    }

    try {
      const res = await fetch(`${PI_BASE_URL}/api/water`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ml:            waterAmount,
          speed_percent: 80,
          plant_type:    selectedPlant,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsWatering(true);
        setWateringMessage({
          type: "success",
          text: `Watering started — ${waterAmount} ml (~${Math.round(data.estimated_seconds)}s). ${data.remaining_ml} ml remaining after this.`
        });

        // ── Live progress animation ─────────────────────────────────────────
        // The pump dispenses synchronously on the Pi, so the DB total only
        // updates once it's fully done. To show live progress in the UI we
        // interpolate locally: baseline (today's total before this event)
        // + (requested ml × elapsed/duration), capped at the requested ml.
        const baseline   = dispensedTodayMl;
        const totalMl    = waterAmount;
        const durationMs = data.estimated_seconds * 1000;
        const startTime  = Date.now();

        sessionActiveRef.current = true;

        const progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const ratio   = Math.min(1, elapsed / durationMs);
          setDisplayedMl(Math.round((baseline + totalMl * ratio) * 10) / 10);
        }, 250);

        // Poll moisture / is_watering while pump runs (displayedMl untouched — see fetchStatus gate)
        const pollInterval = setInterval(() => fetchStatus(selectedPlant), 2000);

        setTimeout(async () => {
          clearInterval(progressInterval);
          clearInterval(pollInterval);
          sessionActiveRef.current = false;

          // Pull the real, authoritative total from the DB to settle any
          // small difference between estimated and actual dispensed volume.
          await fetchStatus(selectedPlant);
          fetchHistory(selectedPlant);
          fetchRemaining(selectedPlant);
          setWateringMessage(null);
        }, durationMs + 5000);

      } else {
        if (data.error === "Daily limit reached") {
          setWateringMessage({
            type: "error",
            text: `Daily limit of ${data.limit_ml} ml already reached for ${plantSettings[selectedPlant].label} today.`
          });
        } else if (data.error === "Exceeds daily limit") {
          setWateringMessage({
            type: "error",
            text: `Cannot dispense ${waterAmount} ml — only ${data.remaining_ml} ml remaining today for ${plantSettings[selectedPlant].label}.`
          });
        } else {
          setWateringMessage({ type: "error", text: data.error });
        }
      }
    } catch (err) {
      console.error("Failed to send water command:", err);
      setWateringMessage({ type: "error", text: "Failed to reach the Pi. Check your connection." });
    }
  };

  const chartMaxValue = Math.ceil(dailyMax * 1.2);

  return (
    <div className="min-h-screen bg-[#f3f5f2] flex justify-center py-6 px-4 md:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-sm md:max-w-4xl xl:max-w-6xl">
        <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-green-800 text-center mb-6 md:mb-8">
          Remote Plant <br className="md:hidden" />
          Watering System
        </h1>

        <div className="space-y-5 xl:space-y-0 xl:grid xl:grid-cols-14 xl:gap-6 xl:items-stretch">
          <div className="space-y-5 xl:col-span-7 xl:flex xl:flex-col xl:h-full">
            <div className="xl:flex-1">
              <CameraCard amtRequested={waterAmount} />
            </div>
            <button
              onClick={handleWaterPlant}
              disabled={isWatering || remainingMl <= 0}
              className="w-full bg-green-700 hover:bg-green-900 disabled:bg-gray-400 transition text-white text-2xl md:text-3xl tracking-wide py-4 md:py-5 rounded-2xl shadow-lg xl:shrink-0"
            >
              {isWatering
                ? `Watering Plant with ${waterAmount} ml...`
                : remainingMl <= 0
                ? "Daily Limit Reached"
                : "Water Plant"}
            </button>
          </div>

          <div className="space-y-5 xl:col-span-7 xl:flex xl:flex-col">
            <StatsSection
              moisturePercent={moisturePercent}
              dispensedTodayMl={displayedMl}
              dailyMax={dailyMax}
            />
            <PlantSelector
              selectedPlant={selectedPlant}
              onPlantChange={setSelectedPlant}
              disabled={isWatering}
            />
            <WaterAmountSlider
              waterAmount={waterAmount}
              onChange={setWaterAmount}
              maxAmount={Math.min(dailyMax, remainingMl)}
              message={wateringMessage}
            />
            <div className="xl:flex-1">
              <WeeklyHistoryChart
                weeklyData={weeklyData}
                days={days}
                maxValue={chartMaxValue}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
