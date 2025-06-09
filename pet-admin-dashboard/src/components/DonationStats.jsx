"use client";
import { useState, useEffect } from "react";

export default function DonationStats() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    // Mock data - in a real app, you'd fetch this from an API
    const mockDonations = [
      {
        id: 1,
        donor: "John Smith",
        amount: 150,
        date: "2024-01-18",
        status: "completed",
      },
      {
        id: 2,
        donor: "Sarah Johnson",
        amount: 75,
        date: "2024-01-17",
        status: "completed",
      },
      {
        id: 3,
        donor: "Michael Brown",
        amount: 250,
        date: "2024-01-15",
        status: "completed",
      },
      {
        id: 4,
        donor: "Emily Davis",
        amount: 100,
        date: "2024-01-14",
        status: "pending",
      },
    ];

    setDonations(mockDonations);
  }, []);

  // Format date consistently
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Use explicit formatting that doesn't depend on locale
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <div className="space-y-4">
      {donations.map((donation) => (
        <div
          key={donation.id}
          className="flex justify-between items-center p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800/80 transition-all duration-200"
        >
          <div className="space-y-1">
            <h3 className="font-medium text-zinc-100">{donation.donor}</h3>
            <p className="text-xs text-zinc-500">{formatDate(donation.date)}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-zinc-100">
              ${donation.amount}
            </div>
            <div
              className={`text-xs ${
                donation.status === "completed"
                  ? "text-green-400"
                  : "text-amber-400"
              }`}
            >
              {donation.status.charAt(0).toUpperCase() +
                donation.status.slice(1)}
            </div>
          </div>
        </div>
      ))}

      <button className="w-full mt-4 py-2 text-zinc-400 hover:text-white bg-zinc-800/70 hover:bg-zinc-800 rounded-lg transition-all duration-200 text-sm">
        View All Donations
      </button>
    </div>
  );
}
