import React from "react";
import TaskCard from "./TaskCard";

const TaskBoard = ({ tasks, updateTask, removeTask, moveTask }) => {
  return (
    <div className="task-board p-4">
      {tasks.length === 0 ? <p className="text-center">No tasks available</p> : null}
      <div className="d-flex flex-wrap gap-3">
        {tasks.map((task, index) => (
          <TaskCard key={task.id} index={index} task={task} updateTask={updateTask} removeTask={removeTask} moveTask={moveTask} />
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
