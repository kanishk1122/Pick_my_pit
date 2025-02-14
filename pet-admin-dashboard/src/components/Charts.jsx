"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Move Chart.js registration into a client component
const ChartWrapper = dynamic(
  () => import('./ChartWrapper'),
  { ssr: false }
);

// Loader component
const ChartLoader = () => (
  <div className="h-[300px] flex items-center justify-center bg-zinc-800/50 rounded-lg border border-zinc-800">
    <div className="animate-pulse text-zinc-400">Loading chart...</div>
  </div>
);

export const LineChart = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <ChartLoader />;

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue',
      data: [12000, 19000, 15000, 25000, 22000, 30000],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.05)',
      fill: true,
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(244, 244, 245, 0.05)' },
        ticks: { color: '#71717a' }
      },
      x: {
        grid: { color: 'rgba(244, 244, 245, 0.05)' },
        ticks: { color: '#71717a' }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#fff' }
      }
    }
  };

  return (
    <div className="h-[300px]">
      <ChartWrapper type="line" data={chartData} options={chartOptions} />
    </div>
  );
};

export const DoughnutChart = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <ChartLoader />;

  const chartData = {
    labels: ['Medical', 'Food', 'Shelter', 'Other'],
    datasets: [{
      data: [35, 25, 25, 15],
      backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
      borderWidth: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#fff' }
      }
    }
  };

  return (
    <div className="h-[300px]">
      <ChartWrapper type="doughnut" data={chartData} options={chartOptions} />
    </div>
  );
};
