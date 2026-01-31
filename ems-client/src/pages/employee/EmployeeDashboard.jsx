import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "../sytles/EmployeeDashboard.css";

export default function EmployeeDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("home");
  const [tasks, setTasks] = useState([]);
const [employeeName, setEmployeeName] = useState("Employee");
  const [form, setForm] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const [myLeaves, setMyLeaves] = useState([]);
  const formatName = (name = "") =>
  name
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");


  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  
  const fetchLoggedInEmployee = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data?.name) {
      setEmployeeName(formatName(res.data.name));
    }
  } catch (err) {
    console.error(err);
    navigate("/login");
  }
};

  


  //-----------------fetch my task --------------
  const fetchMyTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/tasks/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };


  // ---------------- APPLY LEAVE ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(
    (t) => t.status === "ASSIGNED" || t.status === "ACCEPTED"
  ).length;
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;

  const totalLeaves = myLeaves.length;

  // const user = JSON.parse(localStorage.getItem("user"));

  //------------------------Take action ---------------
  const handleTaskAction = async (taskId, action) => {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/tasks/${taskId}/${action}`,
        {}, // no body needed
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`Task ${action}ed successfully`);
      fetchMyTasks(); // refresh UI
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update task");
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/leaves/apply",
        {
          leaveType: form.leaveType,
          fromDate: form.fromDate,
          toDate: form.toDate,
          reason: form.reason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Leave applied successfully");

      setForm({
        leaveType: "",
        fromDate: "",
        toDate: "",
        reason: "",
      });

      fetchMyLeaves();
      setActiveTab("myLeaves");
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("RESPONSE:", err.response);
      console.log("DATA:", err.response?.data);
      console.log("STATUS:", err.response?.status);
      alert(err.response?.data?.message || "Failed to apply leave");
    }
  };

  // ---------------- FETCH MY LEAVES ----------------
  const fetchMyLeaves = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/leaves/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMyLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
    fetchMyTasks();
      fetchLoggedInEmployee();
  }, []);

  return (
    <div className="dashboard-wrapper">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Employee Panel</h2>

        <ul className="sidebar-menu">

          <li
            className={`sidebar-item ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            Home
          </li>


          <li
            className={`sidebar-item ${activeTab === "apply" ? "active" : ""}`}
            onClick={() => setActiveTab("apply")}
          >
            Apply Leave
          </li>
          <li
            className={`sidebar-item ${activeTab === "tasks" ? "active" : ""}`}
            onClick={() => setActiveTab("tasks")}
          >
            My Tasks
          </li>


          <li
            className={`sidebar-item ${activeTab === "myLeaves" ? "active" : ""}`}
            onClick={() => setActiveTab("myLeaves")}
          >
            My Leaves
          </li>

          <li className="sidebar-item" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* APPLY LEAVE */}

        {activeTab === "home" && (
          <div className="employee-home">
            <h2 className="dashboard-heading">
Welcome {employeeName} 👋
            </h2>

            <p className="home-date">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

            <div className="home-cards">
              <div className="home-card">
                <h3>{totalTasks}</h3>
                <p>Total Tasks</p>
              </div>

              <div className="home-card warning">
                <h3>{pendingTasks}</h3>
                <p>Pending Tasks</p>
              </div>

              <div className="home-card success">
                <h3>{completedTasks}</h3>
                <p>Completed Tasks</p>
              </div>

              <div className="home-card info">
                <h3>{totalLeaves}</h3>
                <p>Leave Requests</p>
              </div>
            </div>
          </div>
        )}



        {activeTab === "apply" && (
          <>
            <h2 className="dashboard-heading">Apply for Leave</h2>

            <form className="leave-form" onSubmit={handleSubmit}>
              <select
                name="leaveType"
                value={form.leaveType}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Leave Type
                </option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Annual Leave">Annual Leave</option>
              </select>

              <input
                type="date"
                name="fromDate"
                value={form.fromDate}
                onChange={handleChange}
                required
              />

              <input
                type="date"
                name="toDate"
                value={form.toDate}
                onChange={handleChange}
                required
              />

              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Reason for leave"
                rows="4"
                required
              />

              <button type="submit">Apply Leave</button>
            </form>
          </>
        )}

        {/* MY LEAVES */}
        {activeTab === "myLeaves" && (
          <>
            <h2 className="dashboard-heading">My Leave Requests</h2>

            {myLeaves.length === 0 ? (
              <p>No leave requests found</p>
            ) : (
              <div className="leave-card-container">
                {myLeaves.map((leave) => (
                  <div className="leave-card" key={leave._id}>
                    <div className="leave-card-header">
                      <h3>{leave.leaveType}</h3>
                      <span className={`status ${leave.status.toLowerCase()}`}>
                        {leave.status}
                      </span>
                    </div>

                    <div className="leave-card-body">
                      <p>
                        <strong>Reason:</strong> {leave.reason}
                      </p>

                      <p>
                        <strong>From:</strong>{" "}
                        {new Date(leave.fromDate).toLocaleDateString()}
                      </p>

                      <p>
                        <strong>To:</strong>{" "}
                        {new Date(leave.toDate).toLocaleDateString()}
                      </p>
                    </div>


                    <div className="leave-card-footer">
                      <strong>Remark:</strong>{" "}
                      {leave.status === "PENDING" && (
                        <span className="remark pending">
                          Waiting for approval
                        </span>
                      )}
                      {leave.status === "APPROVED" && (
                        <span className="remark approved">
                          Approved by Admin/HR
                        </span>
                      )}
                      {leave.status === "REJECTED" && (
                        <span className="remark rejected">
                          Rejected by Admin/HR
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}


        {/* //Task  
// */}

        {activeTab === "tasks" && (
          <>
            <h2 className="dashboard-heading">My Tasks</h2>

            {tasks.length === 0 ? (
              <p>No tasks assigned</p>
            ) : (
              <div className="leave-card-container">
                {tasks.map((task) => (
                  <div className="leave-card" key={task._id}>
                    <div className="leave-card-header">
                      <h3>{task.title}</h3>
                      <span className={`status ${task.status.toLowerCase()}`}>
                        {task.status}
                      </span>
                    </div>

                    <div className="leave-card-body">
                      <p>
                        <strong>Description:</strong> {task.description}
                      </p>

                      <p>
                        <strong>Assigned On:</strong>{" "}
                        {new Date(task.createdAt).toLocaleDateString()}
                      </p>

                      {task.deadline && (
                        <p>
                          <strong>Deadline:</strong>{" "}
                          {new Date(task.deadline).toLocaleDateString()}
                        </p>
                      )}
                    </div>


                    <div className="leave-card-footer task-actions">
                      {task.status === "ASSIGNED" && (
                        <>
                          <button
                            className="btn accept"
                            onClick={() =>
                              handleTaskAction(task._id, "accept")
                            }
                          >
                            Accept
                          </button>

                          <button
                            className="btn reject"
                            onClick={() =>
                              handleTaskAction(task._id, "reject")
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {task.status === "ACCEPTED" && (
                        <button
                          className="btn complete"
                          onClick={() =>
                            handleTaskAction(task._id, "complete")
                          }
                        >
                          Mark Complete
                        </button>
                      )}

                      {task.status === "COMPLETED" && (
                        <span className="remark approved">
                          Task Completed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}
