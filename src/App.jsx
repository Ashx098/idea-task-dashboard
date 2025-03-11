import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import TaskBoard from "./components/TaskBoard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: Date.now() }]);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const removeTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      {/* 🔹 Top Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <span className="navbar-brand">Task Manager</span>
          <div className="navbar-nav">
            <a className="nav-link active" href="#">Home</a>
            <a className="nav-link" href="#">Tasks</a>
            <a className="nav-link" href="#">Settings</a>
          </div>
          {/* 🔹 Dark Mode Toggle */}
          <button className="btn btn-light ms-auto" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </nav>

      {/* 🔹 Layout: Sidebar + Task Board */}
      <div className="d-flex">
        <Sidebar addTask={addTask} />
        <TaskBoard tasks={tasks} updateTask={updateTask} removeTask={removeTask} />
      </div>
    </div>
  );
};

export default App;
