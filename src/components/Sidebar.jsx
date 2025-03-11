import React, { useState } from "react";

const Sidebar = ({ addTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  const handleAddTask = () => {
    if (!title.trim()) return;
    addTask({ title, description, priority });
    setTitle("");
    setDescription("");
    setPriority("Medium");
  };

  return (
    <div className="sidebar bg-dark text-white p-4">
      <h4 className="mb-3">Create Task</h4>
      
      <div className="mb-2">
        <label>Title</label>
        <input type="text" className="form-control" placeholder="Task Title"
          value={title} onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <label>Description</label>
        <textarea className="form-control" placeholder="Task Description"
          value={description} onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <div className="mb-3">
        <label>Priority</label>
        <select className="form-select"
          value={priority} onChange={(e) => setPriority(e.target.value)}
        >
          <option value="High">🔥 High</option>
          <option value="Medium">⚡ Medium</option>
          <option value="Low">🟢 Low</option>
        </select>
      </div>

      <button className="btn btn-success w-100" onClick={handleAddTask}>
        + Add Task
      </button>
    </div>
  );
};

export default Sidebar;
