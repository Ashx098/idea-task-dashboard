import React from "react";
import TaskCard from "./TaskCard";

const TaskBoard = ({ tasks, updateTask, removeTask }) => {
  return (
    <div className="task-board p-4">
      {tasks.length === 0 ? <p className="text-center">No tasks available</p> : null}
      <div className="d-flex flex-wrap gap-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} updateTask={updateTask} removeTask={removeTask} />
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
