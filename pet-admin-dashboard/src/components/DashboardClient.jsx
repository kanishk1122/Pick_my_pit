"use client";

import { useEffect, useState } from 'react';
import { LineChart, DoughnutChart } from "./Charts.jsx";
import StatsCard from "./StatsCard";
import BlogsList from "./BlogsList";
import DonationStats from "./DonationStats";

export default function DashboardClient() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const stats = [
    {
      title: "Total Sales",
      value: "$12,545",
      trend: "+14.5%",
      description: "vs last month",
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      title: "Active Orders",
      value: "45",
      trend: "+5.0%",
      description: "vs last week",
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      title: "Donations",
      value: "$2,350",
      trend: "+23.1%",
      description: "vs last month",
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      title: "Blog Posts",
      value: "128",
      trend: "+2.5%",
      description: "vs last week",
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-zinc-800/30 border border-zinc-800/50 rounded-xl" />
        ))}
        <div className="col-span-1 md:col-span-3 h-96 bg-zinc-800/30 border border-zinc-800/50 rounded-xl" />
        <div className="h-96 bg-zinc-800/30 border border-zinc-800/50 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-zinc-400 mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <button className="px-4 py-2 bg-zinc-800/50 text-zinc-100 rounded-lg hover:bg-zinc-700/50 transition-all duration-200 border border-zinc-700/50 hover:border-zinc-600 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-3 bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-xl backdrop-blur-sm hover:bg-zinc-800/30 transition-all duration-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-zinc-100">Revenue Overview</h2>
            <select className="bg-zinc-800 border border-zinc-700 rounded-md p-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
          </div>
          <LineChart />
        </div>

        <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-xl backdrop-blur-sm hover:bg-zinc-800/30 transition-all duration-200">
          <h2 className="text-xl font-bold mb-4 text-zinc-100">Donation Distribution</h2>
          <DoughnutChart />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-xl backdrop-blur-sm hover:bg-zinc-800/30 transition-all duration-200">
          <h2 className="text-xl font-bold mb-4 text-zinc-100">Recent Blog Posts</h2>
          <BlogsList />
        </div>

        <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-xl backdrop-blur-sm hover:bg-zinc-800/30 transition-all duration-200">
          <h2 className="text-xl font-bold mb-4 text-zinc-100">Latest Donations</h2>
          <DonationStats />
        </div>
      </div>
    </div>
  );
}
