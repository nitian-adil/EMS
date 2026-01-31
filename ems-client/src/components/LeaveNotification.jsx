import { useEffect, useState } from "react";
import axios from "../pages/api/axiosInstance";

export default function LeaveNotifications() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("/leave", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data);
    };
    fetchLeaves();
  }, []);

  return (
    <>
      <h2>🔔 Leave Requests</h2>

      {leaves.map((leave) => (
        <div key={leave._id} className="card">
          <p><b>{leave.employee?.name}</b></p>
          <p>{leave.leaveType}</p>
          <p>{leave.reason}</p>
          <p>Status: {leave.status}</p>
          
        </div>
      ))}
    </>
  );
}
