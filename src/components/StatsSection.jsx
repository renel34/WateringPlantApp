import { BsMoisture } from "react-icons/bs";

function StatsSection({ moisturePercent, dispensedTodayMl, dailyMax }) {
  const dispensedPercent =
    dailyMax > 0 ? Math.min(100, (dispensedTodayMl / dailyMax) * 100) : 0;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl border-2 border-green-200 p-5 shadow-sm">
        <p className="text-xl font-bold text-gray-700">Soil Moisture Level</p>
        <div className="flex flex-row items-center justify-between mt-6 gap-2">
          <span className="text-3xl min-[415px]:text-4xl md:text-6xl lg:text-6xl xl:text-6xl font-light text-gray-800">
            {moisturePercent !== null ? `${moisturePercent}%` : "--"}
          </span>
          <BsMoisture className="text-3xl min-[415px]:text-4xl md:text-6xl lg:text-6xl xl:text-6xl text-emerald-400 shrink-0" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-green-200 p-5 shadow-sm">
        <p className="text-xl font-bold text-gray-700">Water Dispensed</p>
        <div className="mt-5 text-3xl min-[415px]:text-4xl md:text-6xl lg:text-6xl xl:text-6xl font-light text-gray-800">
          {dispensedTodayMl} ml
        </div>
        <div className="w-full h-4 bg-green-100 rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
            style={{ width: `${dispensedPercent}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">Last 24 Hours</p>
      </div>
    </div>
  );
}

export default StatsSection;
