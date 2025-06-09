import React, { useState, useEffect } from "react";
import axios from "axios";
import { USER } from "@Consts/apikeys";
import { useUser } from "@utils/Usercontext";
import { useSwal } from "@utils/Customswal.jsx";

// Mock data for testing purposes
const MOCK_REFERRAL_DATA = [
  {
    userId: "user1",
    userEmail: "friend1@example.com",
    coinsSpent: 120,
    earnings: 12,
  },
  {
    userId: "user2",
    userEmail: "friend2@example.com",
    coinsSpent: 350,
    earnings: 35,
  },
  {
    userId: "user3",
    userEmail: "friend3@example.com",
    coinsSpent: 80,
    earnings: 8,
  },
  {
    userId: "user4",
    userEmail: "bestfriend@example.com",
    coinsSpent: 500,
    earnings: 50,
  },
];

const ReferralLink = ({ user }) => {
  const [referralLink, setReferralLink] = useState("");
  const [referralAnalytics, setReferralAnalytics] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showMockData, setShowMockData] = useState(false);
  const { getUserheader } = useUser();
  const Swal = useSwal();

  useEffect(() => {
    if (user) {
      setUserId(user?.id);
      fetchReferralAnalytics(user?.id);
    }
  }, [user]);

  const generateReferralLink = async () => {
    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "User ID not found",
      });
      return;
    }

    try {
      // For testing, generate a mock referral link
      const mockLink = showMockData
        ? `https://pickmypit.com/signup?referralCode=${Math.random()
            .toString(36)
            .substring(2, 10)}`
        : null;

      let link;

      if (showMockData) {
        link = mockLink;
      } else {
        const response = await axios.get(
          USER.GenerateReferralLink(userId),
          getUserheader()
        );
        link = response.data.referralLink;
      }

      setReferralLink(link);

      // Show success popup with copy button
      Swal.fire({
        icon: "success",
        title: "Referral Link Generated!",
        html: `
          <div class="my-4">
            <p class="mb-2">Share this link with friends:</p>
            <div class="flex items-center w-full border rounded overflow-hidden">
              <input 
                type="text" 
                id="referralLinkInput" 
                value="${link}" 
                class="w-full p-2 outline-none text-sm" 
                readonly
              />
            </div>
          </div>
        `,
        showCancelButton: true,
        cancelButtonText: "Close",
        confirmButtonText: "Copy Link",
        confirmButtonColor: "#10b981",
      }).then((result) => {
        if (result.isConfirmed) {
          navigator.clipboard.writeText(link);
          Swal.fire({
            icon: "success",
            title: "Copied!",
            text: "Referral link copied to clipboard",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      });
    } catch (error) {
      console.error("Error generating referral link:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          error.response?.data?.message || "Failed to generate referral link",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    Swal.fire({
      icon: "success",
      title: "Copied!",
      text: "Referral link copied to clipboard",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const fetchReferralAnalytics = async (userId) => {
    try {
      if (showMockData) {
        // Set mock data for testing
        setReferralAnalytics(MOCK_REFERRAL_DATA);
        return;
      }

      const response = await axios.get(
        USER.ReferralAnalytics(userId),
        getUserheader()
      );
      setReferralAnalytics(response.data.analytics || []);
    } catch (error) {
      console.error("Error fetching referral analytics:", error);
    }
  };

  // Toggle mock data
  const toggleMockData = () => {
    const newState = !showMockData;
    setShowMockData(newState);
    if (newState) {
      setReferralAnalytics(MOCK_REFERRAL_DATA);
    } else {
      setReferralAnalytics([]);
      if (userId) {
        fetchReferralAnalytics(userId);
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl max-w-4xl mx-auto shadow-md">
      <h2 className="text-3xl font-extrabold mb-8">
        <span className="text-green-500">Referral</span> Program
      </h2>

      {/* Development toggle for mock data */}
      <div className="mb-4 flex items-center space-x-2">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showMockData}
            onChange={toggleMockData}
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          <span className="ml-2 text-sm font-medium text-gray-900">
            Show Test Data
          </span>
        </label>
      </div>

      <div className="space-y-6">
        <div className="mb-8">
          <p className="text-lg mb-3">
            Invite friends and earn{" "}
            <span className="font-bold text-green-500">50 coins</span> for each
            successful referral!
          </p>

          <button
            onClick={generateReferralLink}
            className="brand-button group h-[50px] w-full flex gap-4 justify-center items-center text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg px-5 py-2.5 text-center transition-all duration-300"
          >
            <span className="text-xl">Generate Referral Link</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
        </div>

        {referralLink && (
          <div className="form-group mb-8">
            <label className="block text-sm font-semibold mb-2">
              Your Referral Link
            </label>
            <div className="flex">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="w-full p-3 border-2 border-gray-300 rounded-l-xl focus:border-green-500 focus:ring-0 focus:ring-green-200 transition-all outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="bg-green-500 text-white px-4 rounded-r-xl hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                Copy
              </button>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-2xl font-bold mb-4">Referral Analytics</h3>
          <p className="mb-4">
            Your total earnings:{" "}
            <span className="font-bold text-green-500">
              {referralAnalytics.reduce(
                (sum, referral) => sum + referral.earnings,
                0
              )}{" "}
              coins
            </span>
          </p>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-gray-700 font-medium">
                    Referred User
                  </th>
                  <th className="p-4 text-gray-700 font-medium">Coins Spent</th>
                  <th className="p-4 text-gray-700 font-medium">
                    Your Earnings
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {referralAnalytics && referralAnalytics.length > 0 ? (
                  referralAnalytics.map((referral) => (
                    <tr key={referral.userId} className="hover:bg-gray-50">
                      <td className="p-4">{referral.userEmail}</td>
                      <td className="p-4">{referral.coinsSpent}</td>
                      <td className="p-4 text-green-600 font-medium">
                        {referral.earnings}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-500">
                      No referrals yet. Share your link to start earning!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralLink;
