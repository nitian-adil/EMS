import { useEffect, useState } from "react";
import api from "../api/axios";

export default function LeaveList() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    api.get("/leaves").then(res => setLeaves(res.data));
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/leaves/${id}`, { status });
    setLeaves(leaves.map(l => l._id === id ? { ...l, status } : l));
  };

  return (
    <div>
      <h2>Leave Requests</h2>
      {leaves.map(l => (
        <div key={l._id}>
          {l.employee.name} - {l.status}
          <button onClick={() => updateStatus(l._id, "APPROVED")}>Approve</button>
          <button onClick={() => updateStatus(l._id, "REJECTED")}>Reject</button>
        </div>
      ))}
    </div>
  );
}
