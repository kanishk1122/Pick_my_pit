"use client";

const DonationStats = () => {
  const donations = [
    {
      id: 1,
      donor: "John Doe",
      amount: 100,
      cause: "Medical Care",
      date: "2024-01-15"
    },
    {
      id: 2,
      donor: "Sarah Miller",
      amount: 50,
      cause: "Food Supply",
      date: "2024-01-14"
    },
    // Add more donations as needed
  ];

  return (
    <div className="space-y-4">
      {donations.map((donation) => (
        <div key={donation.id} className="flex justify-between items-center p-3 bg-zinc-800/50 backdrop-blur-sm border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-all duration-200">
          <div>
            <h3 className="font-medium text-zinc-100">{donation.donor}</h3>
            <p className="text-sm text-zinc-400">{donation.cause}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-emerald-500">${donation.amount}</p>
            <p className="text-xs text-zinc-400">{donation.date}</p>
          </div>
        </div>
      ))}
      <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg mt-4 transition-all duration-200 border border-zinc-700">
        View All Donations
      </button>
    </div>
  );
};

export default DonationStats;
