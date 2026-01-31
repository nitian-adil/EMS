import { useState } from "react";
import api from "../api/axios";

export default function ApplyLeave() {
  const [leave, setLeave] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: ""
  });

  const submit = async () => {
    await api.post("/leaves/apply", leave);
    alert("Leave Applied");
  };

  return (
    <div>
      <h2>Apply Leave</h2>
      <input placeholder="Type" onChange={e => setLeave({...leave, leaveType: e.target.value})}/>
      <input type="date" onChange={e => setLeave({...leave, fromDate: e.target.value})}/>
      <input type="date" onChange={e => setLeave({...leave, toDate: e.target.value})}/>
      <input placeholder="Reason" onChange={e => setLeave({...leave, reason: e.target.value})}/>
      <button onClick={submit}>Apply</button>
    </div>
  );
}
