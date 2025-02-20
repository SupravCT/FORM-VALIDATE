import React, { useState } from "react";
import axios from "axios";
import form2 from './assests/form3.avif';  

import "./App.css";
const App = () => {
  const [formType, setFormType] = useState("register");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const api = axios.create({
    baseURL: "http://localhost:5000/api/users",
  });
  const handleFetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/all");
      setUsers(response.data);
    } catch (error) {
      setMessage(error.response?.data?.msg || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };
  const toggleUsers = () => {
    setShowUsers(!showUsers);
    if (!showUsers) {
      handleFetchUsers();
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/register", { username, password });
      setMessage(response.data.msg);
    } catch (error) {
      setMessage(error.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/login", { username, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      setMessage("Login successful!");
    } catch (error) {
      setMessage(error.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must be logged in to change your password");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post(
        "/change-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.msg);
    } catch (error) {
      setMessage(error.response?.data?.msg || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user) => {
    setModalData(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  return (
    <div
    className="container"
    style={{
      background: `url(${form2}) no-repeat center center/cover`,  
    }}
  >
      <h1 className="welcome-title">WELCOME</h1>
      {message && <div className="message">{message}</div>}

      {formType === "register" && (
        <form onSubmit={handleRegister}>
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="submit-button" disabled={loading}>
            Register
          </button>
        </form>
      )}

      {formType === "login" && (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="submit-button" disabled={loading}>
            Login
          </button>
        </form>
      )}

      {formType === "changePassword" && (
        <form onSubmit={handleChangePassword}>
          <h2>Change Password</h2>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" className="submit-button" disabled={loading}>
            Change Password
          </button>
        </form>
      )}

      <div className="button-group">
        <button
          onClick={() => setFormType("register")}
          className={`button ${
            formType === "register" ? "active" : "inactive"
          }`}
        >
          Register
        </button>
        <button
          onClick={() => setFormType("login")}
          className={`button ${formType === "login" ? "active" : "inactive"}`}
        >
          Login
        </button>
        <button
          onClick={() => setFormType("changePassword")}
          className={`button ${
            formType === "changePassword" ? "active" : "inactive"
          }`}
        >
          Change Password
        </button>
        <button onClick={toggleUsers} className="button">
          {showUsers ? "Hide All Users" : "Show All Users"}
        </button>
      </div>

      {showUsers && users.length > 0 && (
        <table className="users-table">
          <thead>
            <tr>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} onClick={() => openModal(user)}>
                <td>{user.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && modalData && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>User Details</h2>
            <p>Username: {modalData.username}</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default App;
