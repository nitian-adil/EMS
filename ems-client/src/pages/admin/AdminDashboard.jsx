import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../sytles/AdminDashboard.css";
import api from "../axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


const AdminDashboard = () => {
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [task, setTask] = useState({
    employeeId: "",
    title: "",
    description: "",
    deadline: "",
  });
  const [activePanel, setActivePanel] = useState(""); // Tracks which panel to show
  const [loggedInUserId, setLoggedInUser] = useState(null);
  const roleCounts = {
  ADMIN: employees.filter((e) => e.role === "ADMIN").length,
  HR: employees.filter((e) => e.role === "HR").length,
  EMPLOYEE: employees.filter((e) => e.role === "EMPLOYEE").length,
};
const user = JSON.parse(localStorage.getItem("user"));
const adminName = user?.name || "Admin";


const pieData = [
  { name: "Admin", value: roleCounts.ADMIN },
  { name: "HR", value: roleCounts.HR },
  { name: "Employee", value: roleCounts.EMPLOYEE },
];

const COLORS = ["#ff6b6b", "#4dabf7", "#51cf66"];


  const token = localStorage.getItem("token");

  // 🔴 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Fetch employees
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

  //fetch tasks
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


  // Fetch leave requests
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

  useEffect(() => {
    fetchLeaves();
    fetchEmployees();
    fetchLoggedInUser();
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

      // Update UI instantly
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
      setTask({
        employeeId: "",
        title: "",
        description: "",
        deadline: "",
      });
    } catch (err) {
      console.log(err);
      alert("Failed to assign task");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/auth/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      alert("User deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="admin-container">
      {/* Navbar */}
      <nav className="admin-navbar">
        <h2>Admin Panel</h2>
        <div className="admin-nav-right">
<span className="admin-welcome">
  Welcome, {adminName}
</span>

          <button className="admin-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className="admin-sidebar">

 <button onClick={() => setActivePanel("")}>
            🏠 Home
          </button>

          <button onClick={() => setActivePanel("leaves")}>
            🔔 Leave Requests
          </button>
         
          <button onClick={() => setActivePanel("assignTask")}>
            📌 Assign Task
          </button>
          <button onClick={() => setActivePanel("employees")}>
            👥 Employees
          </button>
        </aside>

        {/* Main Content */}
        <main className="admin-main">

          
        {activePanel === "" && (
  <div className="admin-home">
    <h2>Admin Dashboard</h2>
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



          {/* Leave Requests Panel */}
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
                        <td>
                          {new Date(leave.fromDate).toLocaleDateString()}
                        </td>
                        <td>
                          {(leave.reason)}
                        </td>
                        <td>
                          {new Date(leave.toDate).toLocaleDateString()}
                        </td>
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

          {/* Assign Task Panel */}
          {activePanel === "assignTask" && (
  <section className="assign-task-panel">
                  <h3>Assign Task</h3>

              {/* ASSIGN FORM */}
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

              {/* ASSIGNED TASKS TABLE */}
              <h3 style={{ marginTop: "30px" }}>Assigned Tasks</h3>

              {assignedTasks.length === 0 ? (
                <p>No tasks assigned yet</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Title</th>
                      <th>Deadline</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedTasks.map((task) => (
                      <tr key={task._id}>
                        <td>{task.assignedTo?.name}</td>
                        <td>{task.title}</td>
                        <td>{new Date(task.deadline).toLocaleDateString()}</td>
                        <td>
                          <span className={`status ${task.status.toLowerCase()}`}>
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              )}
            </section>
          )}


          {/* Employees Panel */}
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
                        <button
                          className="delete-badge"
                          onClick={() => handleDelete(emp._id)}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
