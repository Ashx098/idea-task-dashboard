import React, { useState } from "react";

const TaskCard = ({ task, updateTask, removeTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);

  const saveTask = () => {
    updateTask({ ...task, title, description, priority });
    setIsEditing(false);
  };

  return (
    <div className="task-card shadow-sm p-3">
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

        <div className="priority-section">
          {isEditing ? (
            <select value={priority} className="form-control"
              onChange={(e) => setPriority(e.target.value)}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          ) : (
            <span className={`priority-badge priority-${priority.toLowerCase()}`}>
              {priority}
            </span>
          )}
        </div>

        <div className="d-flex justify-content-between mt-2">
          {isEditing ? (
            <button className="btn btn-success btn-sm" onClick={saveTask}>Save</button>
          ) : (
            <button className="btn btn-warning btn-sm" onClick={() => setIsEditing(true)}>Edit</button>
          )}
          <button className="btn btn-danger btn-sm" onClick={() => removeTask(task.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
