import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TaskBoard from "./components/TaskBoard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

/* 🔹 Import React DND */
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

/* 🔹 Firebase */
import { auth, db, provider } from "./firebaseConfig";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [user, setUser] = useState(null);

  /** ✅ Listen to Firebase Auth State **/
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
      if (loggedUser) {
        setUser(loggedUser);
        localStorage.setItem("user", JSON.stringify(loggedUser));
      } else {
        setUser(null);
        localStorage.removeItem("user");
        setTasks([]); // 🔹 Clear tasks when user logs out
      }
    });

    return () => unsubscribe(); // Cleanup auth listener
  }, []);

  /** ✅ Fetch Tasks from Firestore when user logs in **/
  useEffect(() => {
    if (!user) return; // 🔹 Ensure a user is logged in before fetching tasks

    const userTasksRef = collection(db, `users/${user.uid}/tasks`); // ✅ Correct Firestore path

    // ✅ Real-time listener
    const unsubscribe = onSnapshot(userTasksRef, (snapshot) => {
      const updatedTasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log("📡 Updated UI with Firestore data:", updatedTasks);
      setTasks(updatedTasks); // ✅ UI updates instantly
    });

    return () => unsubscribe(); // Cleanup listener
  }, [user]);

  /** 🔹 Sign in with Google **/
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      localStorage.setItem("user", JSON.stringify(result.user));
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  /** 🔹 Logout **/
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setTasks([]);
    localStorage.removeItem("user");
  };

  /** 🔹 Add Task to Firestore **/
  const addTask = async (task) => {
    if (!user) return; // Ensure user is logged in

    const newTask = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      userId: user.uid, // 🔹 Store user ID
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, `users/${user.uid}/tasks`), newTask);
    } catch (error) {
      console.error("❌ Error adding task:", error);
    }
  };

  /** 🔹 Update Task in Firestore **/
  const updateTask = async (updatedTask) => {
    if (!user) return;

    try {
      await updateDoc(doc(db, `users/${user.uid}/tasks/${updatedTask.id}`), updatedTask);
    } catch (error) {
      console.error("❌ Error updating task:", error);
    }
  };

  /** 🔹 Delete Task from Firestore **/
  const removeTask = async (taskId) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, `users/${user.uid}/tasks/${taskId}`));
    } catch (error) {
      console.error("❌ Error deleting task:", error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
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
            <button className="btn btn-light ms-auto" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </button>

            {/* 🔹 Show Login Button if No User */}
            {!user ? (
              <button className="btn btn-success ms-3" onClick={handleLogin}>Sign in with Google</button>
            ) : (
              <>
                <span className="navbar-text ms-3">{user.displayName}</span>
                <button className="btn btn-danger ms-2" onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>
        </nav>

        {/* 🔹 If not logged in, show a message */}
        {!user ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
            <h2>Please sign in to access your tasks.</h2>
          </div>
        ) : (
          <div className="d-flex">
            <Sidebar addTask={addTask} />
            <TaskBoard tasks={tasks} updateTask={updateTask} removeTask={removeTask} />
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default App;
