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
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [activePanel, setActivePanel] = useState("");
  const [loggedInUserId, setLoggedInUser] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const hrName = user?.name || "HR";

  const roleCounts = {
    ADMIN: employees.filter((e) => e.role === "ADMIN").length,
    HR: employees.filter((e) => e.role === "HR").length,
    EMPLOYEE: employees.filter((e) => e.role === "EMPLOYEE").length,
  };

  const pieData = [
    { name: "Admin", value: roleCounts.ADMIN },
    { name: "HR", value: roleCounts.HR },
    { name: "Employee", value: roleCounts.EMPLOYEE },
  ];

  const COLORS = ["#ff6b6b", "#4dabf7", "#51cf66"];

  const token = localStorage.getItem("token");

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/auth/fetchEmployees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch logged-in user
  const fetchLoggedInUser = async () => {
    try {
      const res = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoggedInUser(res.data._id);
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  // Fetch leaves
  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch assigned tasks
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignedTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchLoggedInUser();
    fetchLeaves();
    fetchTasks();
  }, []);

  // Update leave status
  const updateLeaveStatus = async (leaveId, status) => {
    try {
      await api.put(
        `/leaves/${leaveId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLeaves((prev) =>
        prev.map((leave) =>
          leave._id === leaveId ? { ...leave, status } : leave
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update leave status");
    }
  };

  // Assign task
  const handleTaskChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tasks/assign", task, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Task assigned successfully");
      setTask({ employeeId: "", title: "", description: "", deadline: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to assign task");
    }
  };

  // Add employee
  const handleAddEmployee = async (newEmp) => {
    try {
      await api.post("/auth/register", newEmp, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEmployees();
      alert("Employee added successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to add employee");
    }
  };

  return (
    <div className="admin-container">
      {/* Navbar */}
      <nav className="admin-navbar">
        <h2>HR Panel</h2>
        <div className="admin-nav-right">
          <span className="admin-welcome">Welcome, {hrName}</span>
          <button className="admin-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <button onClick={() => setActivePanel("")}>🏠 Home</button>
          <button onClick={() => setActivePanel("leaves")}>🔔 Leave Requests</button>
          <button onClick={() => setActivePanel("assignTask")}>📌 Assign Task</button>
          <button onClick={() => setActivePanel("employees")}>👥 Employees</button>
          <button onClick={() => setActivePanel("reports")}>📊 Reports</button>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {activePanel === "" && (
            <div className="admin-home">
              <h2>HR Dashboard</h2>
              <p>Company Role Distribution</p>
              <div style={{ width: "100%", height: 350 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Leave Requests */}
          {activePanel === "leaves" && (
            <section>
              <h3>Leave Requests</h3>
              {leaves.length === 0 ? (
                <p>No leave requests</p>
              ) : (
                <table className="admin-table">
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
                            <div className="leave-actions">
                              <button
                                className="approve-btn"
                                onClick={() =>
                                  updateLeaveStatus(leave._id, "APPROVED")
                                }
                              >
                                ✔ Approve
                              </button>
                              <button
                                className="reject-btn"
                                onClick={() =>
                                  updateLeaveStatus(leave._id, "REJECTED")
                                }
                              >
                                ✖ Reject
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`status ${leave.status.toLowerCase()}`}
                            >
                              {leave.status}
                            </span>
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
          {activePanel === "assignTask" && (
            <section className="assign-task-panel">
              <h3>Assign Task</h3>
              <form className="task-form" onSubmit={handleAssignTask}>
                <input
                  type="text"
                  name="employeeId"
                  placeholder="Employee ID"
                  value={task.employeeId}
                  onChange={handleTaskChange}
                  required
                />
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
            </section>
          )}

          {/* Employees */}
          {activePanel === "employees" && (
            <section>
              <h3>Employees</h3>
              {employees.length === 0 ? (
                <p>No employees found</p>
              ) : (
                <div className="employee-grid">
                  {employees
                    .filter((emp) => emp._id !== loggedInUserId)
                    .map((emp) => (
                      <div className="employee-card" key={emp._id}>
                        <h4>{emp.name}</h4>
                        <h4>{emp._id}</h4>
                        <span className="role-badge">{emp.role}</span>
                      </div>
                    ))}
                </div>
              )}
            </section>
          )}

          {/* Reports */}
          {activePanel === "reports" && (
            <section>
              <h3>HR Reports</h3>
              <p>Total Employees: {employees.length}</p>
              <p>Total Leave Requests: {leaves.length}</p>
              <p>Pending Leaves: {leaves.filter(l => l.status === "PENDING").length}</p>
              <p>Approved Leaves: {leaves.filter(l => l.status === "APPROVED").length}</p>
              <p>Rejected Leaves: {leaves.filter(l => l.status === "REJECTED").length}</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default HRDashboard;
