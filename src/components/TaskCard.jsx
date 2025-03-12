import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { updateDoc, doc, deleteDoc } from "firebase/firestore"; // 🔹 Import Firestore functions
import { db } from "../firebaseConfig"; // 🔹 Import Firestore Database

const ITEM_TYPE = "TASK";

const TaskCard = ({ task, index, updateTask, removeTask, moveTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status || "To Start"); // 🔹 Default status

  /* 🔹 Make Task Draggable */
  const [{ isDragging }, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  /* 🔹 Make Task Droppable */
  const [, dropRef] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveTask(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  /* 🔹 Save Task to Firestore */
  const saveTask = async () => {
    const updatedTask = { ...task, title, description, priority, status };
    updateTask(updatedTask);

    try {
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, { title, description, priority, status });
    } catch (error) {
      console.error("Error updating task:", error);
    }

    setIsEditing(false);
  };

  /* 🔹 Handle Task Deletion */
  const handleDelete = async () => {
    try {
      const taskRef = doc(db, `users/${task.userId}/tasks/${task.id}`); // ✅ Correct path
      await deleteDoc(taskRef);
      removeTask(task.id); // ✅ Update UI
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  

  return (
    <div ref={(node) => dragRef(dropRef(node))} className="task-card shadow-sm p-3"
         style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div className="card-header text-center">
        {isEditing ? (
          <input value={title} className="form-control title-input"
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h5 className="card-title text-bold">{task.title}</h5>
        )}
      </div>

      <div className="card-body">
        {isEditing ? (
          <textarea value={description} className="form-control description-input"
            onChange={(e) => setDescription(e.target.value)}
          />
        ) : (
          <p className="card-text">{task.description}</p>
        )}

        {/* 🔹 Priority & Status Labels */}
        <div className="d-flex gap-2">
          <span className={`badge priority-${priority.toLowerCase()}`}>{priority}</span>
          <span className={`badge status-${status.replace(/\s+/g, "-").toLowerCase()}`}>{status}</span>
        </div>

        {/* 🔹 Edit Mode - Priority & Status Dropdowns */}
        {isEditing && (
          <>
            <div className="mt-2">
              <label><b>Priority:</b></label>
              <select value={priority} className="form-control"
                onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="mt-2">
              <label><b>Status:</b></label>
              <select value={status} className="form-control"
                onChange={(e) => setStatus(e.target.value)}>
                <option value="To Start">To Start</option>
                <option value="In Progress">In Progress</option>
                <option value="Need Review">Need Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </>
        )}

        {/* 🔹 Buttons */}
        <div className="d-flex justify-content-between mt-2">
          {isEditing ? (
            <button className="btn btn-success btn-sm" onClick={saveTask}>Save</button>
          ) : (
            <button className="btn btn-warning btn-sm" onClick={() => setIsEditing(true)}>Edit</button>
          )}
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
