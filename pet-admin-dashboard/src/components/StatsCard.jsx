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

export default function StatsCard({ title, value, trend, icon, description }) {
  const isPositiveTrend = trend?.startsWith('+');

  return (
    <div className="stats-card group">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="stats-value">{value}</h3>
          <p className="stats-label">{title}</p>
        </div>
        
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 
                        border border-indigo-500/20 flex items-center justify-center
                        group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>

      {(trend || description) && (
        <div className="flex items-center gap-2 mt-4">
          {trend && (
            <span className={`text-sm font-medium flex items-center gap-1
              ${isPositiveTrend ? 'text-emerald-400' : 'text-red-400'}`}>
              {isPositiveTrend ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                </svg>
              )}
              {trend}
            </span>
          )}
          {description && (
            <span className="text-sm text-zinc-500">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}