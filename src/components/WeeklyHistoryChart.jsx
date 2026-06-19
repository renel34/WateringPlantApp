import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

function WeeklyHistoryChart({ weeklyData, days, maxValue }) {
  const data = {
    labels: days,
    datasets: [
      {
        label: "Water Dispensed",
        data: weeklyData,
        backgroundColor: "rgba(74, 222, 128, 0.6)",
        borderColor: "#4ade80",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        borderColor: "#22c55e",
        borderWidth: 2,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `${context.parsed.y} ml`;
          },
        },
      },
      datalabels: {
        display: true,
        align: "top",
        anchor: "end",
        offset: -3,
        color: "#222",
        font: {
          size: 12,
          weight: 500,
        },
        formatter: function (value) {
          return `${value} ml`;
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          color: "#22c55e",
          width: 2,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 14,
          },
        },
      },
      y: {
        min: 0,
        max: maxValue,
        grid: {
          color: "#e5e7eb",
          drawBorder: false,
        },
        border: {
          color: "#22c55e",
          width: 2,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
          },
          callback: function (value) {
            return value + " ml";
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-green-200 p-6 shadow-sm h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
        <h2 className="text-2xl md:text-3xl font-medium text-gray-800">
          Weekly Watering History
        </h2>
        <span className="text-sm text-gray-500">Water Dispensed (ml)</span>
      </div>

      <div className="flex-1 min-h-50">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default WeeklyHistoryChart;
