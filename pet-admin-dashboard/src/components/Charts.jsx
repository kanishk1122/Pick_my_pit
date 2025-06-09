"use client";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function LineChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue",
        data: [
          500, 1200, 750, 2500, 1800, 1600, 2800, 3200, 2950, 3500, 4200, 3800,
        ],
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.3,
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
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#9ca3af",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#9ca3af",
          callback: function (value) {
            return "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
      },
    },
  };

  if (!mounted) {
    // Return a placeholder with the same dimensions to avoid layout shift
    return <div className="w-full h-[300px] bg-zinc-800/30 rounded-lg"></div>;
  }

  return (
    <div className="w-full h-[300px]">
      <Line data={data} options={options} />
    </div>
  );
}

export function DoughnutChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = {
    labels: ["Medical", "Food", "Shelter", "Events", "Other"],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)", // Indigo
          "rgba(129, 140, 248, 0.8)", // Light Indigo
          "rgba(79, 70, 229, 0.8)", // Darker Indigo
          "rgba(67, 56, 202, 0.8)", // Even Darker Indigo
          "rgba(55, 48, 163, 0.8)", // Darkest Indigo
        ],
        borderColor: [
          "rgba(99, 102, 241, 1)",
          "rgba(129, 140, 248, 1)",
          "rgba(79, 70, 229, 1)",
          "rgba(67, 56, 202, 1)",
          "rgba(55, 48, 163, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#9ca3af",
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
    cutout: "70%",
  };

  if (!mounted) {
    // Return a placeholder with the same dimensions to avoid layout shift
    return <div className="w-full h-[250px] bg-zinc-800/30 rounded-lg"></div>;
  }

  return (
    <div className="w-full h-[250px]">
      <Doughnut data={data} options={options} />
    </div>
  );
}
