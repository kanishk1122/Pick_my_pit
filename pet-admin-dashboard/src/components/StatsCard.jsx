"use client";

import Image from "next/image";
import { LineChart, DoughnutChart } from "../components/Charts";
import StatsCard from "../components/StatsCard";
import BlogsList from "../components/BlogsList";
import DonationStats from "../components/DonationStats";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
        {/* Stats Cards */}
        <StatsCard 
          title="Total Sales" 
          value="$12,545" 
          trend="+14.5%" 
          icon="📈" 
        />
        <StatsCard 
          title="Active Orders" 
          value="45" 
          trend="+5.0%" 
          icon="🛍️" 
        />
        <StatsCard 
          title="Donations" 
          value="$2,350" 
          trend="+23.1%" 
          icon="💝" 
        />
        <StatsCard 
          title="Blog Posts" 
          value="128" 
          trend="+2.5%" 
          icon="📝" 
        />

        {/* Charts Section */}
        <div className="col-span-1 md:col-span-3 bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Revenue Overview</h2>
            <select className="bg-gray-700 rounded-md p-2">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
          </div>
          <LineChart />
        </div>

        {/* Donation Stats */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Donation Distribution</h2>
          <DoughnutChart />
        </div>

        {/* Recent Blogs */}
        <div className="col-span-1 md:col-span-2 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Recent Blog Posts</h2>
          <BlogsList />
        </div>

        {/* Donation Stats */}
        <div className="col-span-1 md:col-span-2 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Latest Donations</h2>
          <DonationStats />
        </div>
      </div>
    </div>
  );
}

export default function StatsCard({ title, value, trend, description, icon }) {
  const isTrendPositive = trend?.startsWith('+');
  
  return (
    <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 p-5 rounded-xl hover:bg-zinc-800/30 transition-all duration-200">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-zinc-500 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend && (
            <div className="flex items-center gap-1">
              <span className={`text-xs font-medium ${isTrendPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {trend}
              </span>
              <span className="text-xs text-zinc-500">{description}</span>
            </div>
          )}
        </div>
        <div className="p-2.5 rounded-lg bg-zinc-800/70 border border-zinc-700/50">
          {icon}
        </div>
      </div>
    </div>
  );
}