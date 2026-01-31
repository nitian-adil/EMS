import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../sytles/HrDashboard.css";
import api from "../axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const HRDashboard = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [task, setTask] = useState({
    employeeId: "",
    title: "",
    description: "",
    deadline: "",
  });
  const [myTasks, setMyTasks] = useState([]);


  const PIE_COLORS = ["#a78bfa", "#c4b5fd", "#f3e8ff"]; // purple shades

  const [activePanel, setActivePanel] = useState("");
  const [loggedInUserId, setLoggedInUser] = useState(null);
  const [assignedTasks, setAssignedTasks] = useState([]);

  const pendingLeavesCount = leaves.filter(l => l.status === "PENDING").length;
  const user = JSON.parse(localStorage.getItem("user"));
  const hrName = user?.name || "HR";
  const token = localStorage.getItem("token");

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  //fetch tasks 


  // Fetch employees, leaves, tasks
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/auth/fetchEmployees", { headers: { Authorization: `Bearer ${token}` } });
      setEmployees(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchAllTasks = async () => {
  try {
    const res = await api.get("/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAssignedTasks(res.data);
  } catch (err) {
    console.error(err);
  }
};


  const fetchLoggedInUser = async () => {
    try {
      const res = await api.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } });
      setLoggedInUser(res.data._id);
    } catch (err) { console.error(err); navigate("/login"); }
  };

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leaves", { headers: { Authorization: `Bearer ${token}` } });
      setLeaves(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

useEffect(() => {
  fetchEmployees();
  fetchLoggedInUser();
  fetchLeaves();
  fetchTasks();
  fetchAllTasks(); // ✅ call the function
}, []);

  // Attendance
  const presentEmployees = employees.filter(
    (emp) => !leaves.some((l) => l.employee?._id === emp._id && l.status === "APPROVED")
  ).length;
  const absentEmployees = employees.length - presentEmployees;
  const barData = [{ name: "Employees", Present: presentEmployees, Absent: absentEmployees }];

  // Role counts
  const roleCounts = {
    ADMIN: employees.filter(e => e.role === "ADMIN").length,
    HR: employees.filter(e => e.role === "HR").length,
    EMPLOYEE: employees.filter(e => e.role === "EMPLOYEE").length,
  };
  const pieData = [
    { name: "Admin", value: roleCounts.ADMIN },
    { name: "HR", value: roleCounts.HR },
    { name: "Employee", value: roleCounts.EMPLOYEE },
  ];

  // Update leave status
  const updateLeaveStatus = async (leaveId, status) => {
    try {
      await api.put(`/leaves/${leaveId}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      setLeaves(prev => prev.map(l => l._id === leaveId ? { ...l, status } : l));
    } catch (err) { console.error(err); alert("Failed to update leave status"); }
  };

  // Assign task
  const handleTaskChange = (e) => setTask({ ...task, [e.target.name]: e.target.value });

const handleAssignTask = async (e) => {
  e.preventDefault();

  if (!task.employeeId) {
    return alert("Please select an employee to assign task");
  }

  try {
    console.log("Assigning task payload:", task);

    const res = await api.post("/tasks/assign", task, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert(res.data.message);

    // Clear task form
    setTask({ employeeId: "", title: "", description: "", deadline: "" });

    // Refresh tasks
    fetchAllTasks();

  } catch (err) {
    console.error(err);
    const msg =
      err.response?.data?.message || "Failed to assign task due to server error";
    alert(msg);
  }
};


  return (
    <div className="hr-container">
      <nav className="hr-navbar">
        <h2>HR Panel</h2>
        <div className="hr-nav-right">
          <span className="hr-welcome">Welcome, {hrName}</span>
          <button className="hr-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="hr-dashboard-body">
        <aside className="hr-sidebar">
          {[
            { key: "", label: "🏠 Home" },
            { key: "leaves", label: "🔔 Leave Requests" },
            { key: "assignTask", label: "📌 Assign Task" },
            { key: "myTasks", label: "📝 My Tasks" },
            { key: "employees", label: "👥 Employees" },
            { key: "reports", label: "📊 Reports" },
          ].map((item) => (
            <button
              key={item.key}
              className={`hr-sidebar-btn ${activePanel === item.key ? "active" : ""
                }`}
              onClick={() => setActivePanel(item.key)}
            >
              <span className="hr-btn-text">{item.label}</span>

              {activePanel === item.key && (
                <span className="hr-arrow">➤</span>
              )}
            </button>
          ))}
        </aside>

        <main className="hr-main">
          {/* Home - Bar chart */}
          {activePanel === "" && (
            <div className="hr-home">
              <h2>HR Dashboard</h2>
              <p>Employee Attendance Overview</p>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Present" fill="#a78bfa" /> {/* purple */}
                  <Bar dataKey="Absent" fill="#f3e8ff" />   {/* light purple */}
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Leave Requests */}
          {activePanel === "leaves" && (
            <section>
              <h3>Leave Requests</h3>
              {leaves.length === 0 ? <p>No leave requests</p> : (
                <table className="hr-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Type</th>
                      <th>From</th>
                      <th>Description</th>
                      <th>To</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map((leave) => (
                      <tr key={leave._id}>
                        <td>{leave.employee?.name}</td>
                        <td>{leave.leaveType}</td>
                        <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                        <td>{leave.reason}</td>
                        <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                        <td>
                          {leave.status === "PENDING" ? (
                            <div className="hr-leave-actions">
                              <button className="hr-approve-btn" onClick={() => updateLeaveStatus(leave._id, "APPROVED")}>✔ Approve</button>
                              <button className="hr-reject-btn" onClick={() => updateLeaveStatus(leave._id, "REJECTED")}>✖ Reject</button>
                            </div>
                          ) : (
                            <span className={`hr-status ${leave.status.toLowerCase()}`}>{leave.status}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          )}

          {/* Assign Task */}
         {/* Assign Task */}
{activePanel === "assignTask" && (
  <section className="hr-assign-task-panel">
    <h3>Assign Task</h3>

    <form className="hr-task-form" onSubmit={handleAssignTask}>
      <input
        type="text"
        name="title"
        placeholder="Task Title"
        value={task.title}
        onChange={handleTaskChange}
        required
      />
      <textarea
        name="description"
        placeholder="Task Description"
        value={task.description}
        onChange={handleTaskChange}
        required
      />
      <input
        type="date"
        name="deadline"
        value={task.deadline}
        onChange={handleTaskChange}
        min={new Date().toISOString().split("T")[0]}
        required
      />
      <button type="submit">Assign Task</button>
    </form>

    {/* Employee Selector */}
    <div className="employee-selector">
      <h4>Select Employee</h4>

      <div className="employee-grid-boxes">
        {employees
          .filter(emp => ["EMPLOYEE", "HR"].includes(emp.role?.toUpperCase().trim()))
          .map(emp => (
            <div
              key={emp._id}
              className={`employee-card-box ${task.employeeId === emp._id ? "selected" : ""}`}
              onClick={() => setTask(prev => ({ ...prev, employeeId: emp._id }))}
            >
              <div className="employee-avatar">👤</div>

              <div className="employee-info">
                <span className="employee-name">{emp.name}</span>
                <span className="employee-role">{emp.role}</span>
              </div>
            </div>
          ))}
      </div>
    </div>

    {/* Selected Employee Tasks */}
    {task.employeeId && (
      <div className="employee-task-list">
        <h4>Assigned Tasks</h4>

        {assignedTasks.filter(t => t.assignedTo?._id === task.employeeId).length === 0 ? (
          <p>No tasks assigned to this employee</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Deadline</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {assignedTasks
                .filter(t => t.assignedTo?._id === task.employeeId)
                .map(taskItem => (
                  <tr key={taskItem._id}>
                    <td>{taskItem.title}</td>
                    <td>{new Date(taskItem.deadline).toLocaleDateString()}</td>
                    <td>
                      <span className={`status ${taskItem.status.toLowerCase()}`}>
                        {taskItem.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    )}
  </section>
)}


          {/* Employees */}
          {activePanel === "employees" && (
            <section>
              <h3>Employees</h3>
              {employees.length === 0 ? <p>No employees found</p> : (
                <div className="hr-employee-grid">
                  {employees.filter(emp => emp._id !== loggedInUserId).map(emp => (
                    <div className="hr-employee-card" key={emp._id}>
                      <h4>{emp.name}</h4>
                      <h4>{emp._id}</h4>
                      <span className="hr-role-badge">{emp.role}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Reports - Pie chart */}
          {activePanel === "reports" && (
            <section>
              <h3>HR Reports</h3>
              <p>Total Employees: {employees.length}</p>
              <p>Total Leave Requests: {leaves.length}</p>
              <p>Pending Leaves: {leaves.filter(l => l.status === "PENDING").length}</p>
              <p>Approved Leaves: {leaves.filter(l => l.status === "APPROVED").length}</p>
              <p>Rejected Leaves: {leaves.filter(l => l.status === "REJECTED").length}</p>

              <div style={{ width: "100%", height: 350, marginTop: "20px" }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label={({ name, percent, x, y }) => (
                        <text x={x} y={y} fill="#1f1f1f" textAnchor="middle" dominantBaseline="central" fontSize={12}>
                          {`${name} (${(percent * 100).toFixed(0)}%)`}
                        </text>
                      )}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default HRDashboard;
