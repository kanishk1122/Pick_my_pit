"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { LineChart, DoughnutChart } from "./Charts.jsx";
import StatsCard from "./StatsCard";
import BlogsList from "./BlogsList";
import DonationStats from "./DonationStats";

export default function DashboardClient() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalPets: 0,
    availablePets: 0,
    totalUsers: 0,
    pendingAdoptions: 0,
  });

  useEffect(() => {
    // Here you would fetch your dashboard statistics
    // For now, using placeholder data
    setStats({
      totalPets: 120,
      availablePets: 75,
      totalUsers: 430,
      pendingAdoptions: 12,
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-zinc-400 mt-1">
            Welcome back, {user?.name || user?.username || "Admin"}! Here's your
            overview.
          </p>
        </div>
        <button className="px-4 py-2 bg-zinc-800/50 text-zinc-100 rounded-lg hover:bg-zinc-700/50 transition-all duration-200 border border-zinc-700/50 hover:border-zinc-600 flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-zinc-800/90 p-6 rounded-xl border border-zinc-700/50 backdrop-blur-sm">
          <h3 className="text-zinc-400 mb-2">Total Pets</h3>
          <p className="text-3xl font-bold text-white">{stats.totalPets}</p>
        </div>
        <div className="bg-zinc-800/90 p-6 rounded-xl border border-zinc-700/50 backdrop-blur-sm">
          <h3 className="text-zinc-400 mb-2">Available Pets</h3>
          <p className="text-3xl font-bold text-white">{stats.availablePets}</p>
        </div>
        <div className="bg-zinc-800/90 p-6 rounded-xl border border-zinc-700/50 backdrop-blur-sm">
          <h3 className="text-zinc-400 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
        </div>
        <div className="bg-zinc-800/90 p-6 rounded-xl border border-zinc-700/50 backdrop-blur-sm">
          <h3 className="text-zinc-400 mb-2">Pending Adoptions</h3>
          <p className="text-3xl font-bold text-white">
            {stats.pendingAdoptions}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-3 bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-xl backdrop-blur-sm hover:bg-zinc-800/30 transition-all duration-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-zinc-100">
              Revenue Overview
            </h2>
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
          <h2 className="text-xl font-bold mb-4 text-zinc-100">
            Donation Distribution
          </h2>
          <DoughnutChart />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-xl backdrop-blur-sm hover:bg-zinc-800/30 transition-all duration-200">
          <h2 className="text-xl font-bold mb-4 text-zinc-100">
            Recent Blog Posts
          </h2>
          <BlogsList />
        </div>

        <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-xl backdrop-blur-sm hover:bg-zinc-800/30 transition-all duration-200">
          <h2 className="text-xl font-bold mb-4 text-zinc-100">
            Latest Donations
          </h2>
          <DonationStats />
        </div>
      </div>
    </div>
  );
}
