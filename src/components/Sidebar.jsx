import React, { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore"; // 🔹 Ensure Timestamp is imported
import { auth, db } from "../firebaseConfig"; // 🔹 Firebase imports

const Sidebar = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("To Start");
  const [error, setError] = useState(null);

  // ✅ Function to handle task addition
  const handleAddTask = async () => {
    if (!title.trim()) {
      setError("⚠️ Task title cannot be empty.");
      return;
    }
    if (!auth.currentUser) {
      setError("⚠️ You must be logged in to add a task.");
      return;
    }

    const userId = auth.currentUser.uid;
    const newTask = {
      title,
      description,
      priority,
      status,
      userId,
      createdAt: Timestamp.now(), // ✅ Firestore timestamp instead of `new Date()`
    };

    try {
      console.log("⚡ Adding task for user:", userId);
      await addDoc(collection(db, `users/${userId}/tasks`), newTask);
      console.log("✅ Task added successfully:", newTask);

      // ✅ Clear input fields
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setStatus("To Start");
      setError(null);
    } catch (error) {
      console.error("❌ Firestore Error:", error);
      setError("🚨 Failed to add task. Check Firestore permissions.");
    }
  };

  return (
    <div className="sidebar bg-dark text-white p-4">
      <h4 className="mb-3">Create Task</h4>

      {/* ✅ Show Errors */}
      {error && <p className="text-danger">{error}</p>}

      {/* 🔹 Title Field */}
      <div className="mb-2">
        <label>Title</label>
        <input
          type="text"
          className="form-control"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* 🔹 Description Field */}
      <div className="mb-2">
        <label>Description</label>
        <textarea
          className="form-control"
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      {/* 🔹 Priority Field */}
      <div className="mb-2">
        <label>Priority</label>
        <select
          className="form-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="High">🔥 High</option>
          <option value="Medium">⚡ Medium</option>
          <option value="Low">🟢 Low</option>
        </select>
      </div>

      {/* 🔹 Status Field */}
      <div className="mb-3">
        <label>Status</label>
        <select
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="To Start">To Start</option>
          <option value="In Progress">In Progress</option>
          <option value="Need Review">Need Review</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* 🔹 Add Task Button */}
      <button className="btn btn-success w-100" onClick={handleAddTask}>
        + Add Task
      </button>
    </div>
  );
};

export default Sidebar;
