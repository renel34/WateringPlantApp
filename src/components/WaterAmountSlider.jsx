function WaterAmountSlider({ waterAmount, onChange, maxAmount, message }) {
  const messageStyles = {
    error:   "bg-red-50 border border-red-200 text-red-700",
    warning: "bg-yellow-50 border border-yellow-200 text-yellow-700",
    success: "bg-green-50 border border-green-200 text-green-700",
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-green-200 p-6 shadow-sm">
      <p className="text-lg font-bold text-gray-700 mb-8">
        Adjust Water Amount: 0-{maxAmount} ml
      </p>
      <div className="flex justify-center mb-5">
        <span className="bg-green-700 text-white px-4 py-2 rounded-lg text-xl shadow">
          {waterAmount} ml
        </span>
      </div>
      <input
        type="range"
        min="0"
        max={maxAmount}
        value={waterAmount}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-emerald-500"
      />

      {/* Shared message area — daily limit warnings, errors, and success messages */}
      {message && (
        <div className={`rounded-xl px-4 py-3 mt-5 text-sm md:text-base ${messageStyles[message.type]}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}

export default WaterAmountSlider;
