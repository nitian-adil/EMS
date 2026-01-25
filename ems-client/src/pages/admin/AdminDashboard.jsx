import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../sytles/AdminDashboard.css";
import api from "../axios";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [task, setTask] = useState({
    employeeId: "",
    title: "",
    description: "",
    deadline: "",
  });
  const [activePanel, setActivePanel] = useState(""); // Tracks which panel to show
  const [loggedInUserId, setLoggedInUser] = useState(null);

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
          <span className="admin-welcome">Welcome, Admin 👋</span>
          <button className="admin-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className="admin-sidebar">
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
            <div className="blank-panel">
              <h2>Select a panel from sidebar</h2>
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
            <section>
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
                  required
                />
                <button type="submit">Assign Task</button>
              </form>
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
