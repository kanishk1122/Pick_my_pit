import axios from "axios";

export default async function handler(req, res) {
  try {
    const response = await axios.get(
      `${process.env.BACKEND_URL || "http://localhost:5000"}/api/breeds/all`,
      {
        headers: {
          // Forward authorization if needed
          ...(req.headers.authorization && {
            Authorization: req.headers.authorization,
          }),
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching breeds:", error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Failed to fetch breeds",
    });
  }
}
