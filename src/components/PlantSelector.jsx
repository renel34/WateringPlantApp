import plantSettings from "./plantSettings";

function PlantSelector({ selectedPlant, onPlantChange, disabled }) {
  const handleChange = (e) => {
    onPlantChange(e.target.value);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-green-200 p-6 shadow-sm">
      <h2 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4">
        Plant Type
      </h2>

      <div className="space-y-4">
        <select
          value={selectedPlant}
          onChange={handleChange}
          disabled={disabled}
          className="w-full px-4 py-3 text-lg border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500 bg-white cursor-pointer transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
        >
          {Object.entries(plantSettings).map(([key, plant]) => (
            <option key={key} value={key}>
              {plant.label}
            </option>
          ))}
        </select>

        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">Daily Water Need:</span>{" "}
            {plantSettings[selectedPlant].defaultMlPerDay} ml
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Usage:</span>{" "}
            {plantSettings[selectedPlant].description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PlantSelector;
