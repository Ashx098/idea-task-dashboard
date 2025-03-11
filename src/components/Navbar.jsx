import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full bg-blue-600 text-white flex justify-between p-4 shadow-md">
      <h1 className="text-xl font-bold">Task Manager</h1>
      <div className="flex gap-4">
        <button className="hover:underline">Home</button>
        <button className="hover:underline">Tasks</button>
        <button className="hover:underline">Settings</button>
      </div>
    </nav>
  );
};

export default Navbar;
