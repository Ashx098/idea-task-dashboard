import React, { useState, useEffect } from "react";
import { auth, provider } from "../firebaseConfig";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const Auth = ({ setUser }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ User Logged In:", user);
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        console.log("❌ No user detected. Try logging in.");
        setUser(null);
        localStorage.removeItem("user");
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  const handleLogin = async () => {
    try {
      console.log("⚡ Attempting to sign in...");
      const result = await signInWithPopup(auth, provider);
      console.log("✅ Login Success:", result.user);
      setUser(result.user);
      localStorage.setItem("user", JSON.stringify(result.user));
    } catch (error) {
      console.error("❌ Login failed:", error);
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      console.log("⚡ Logging out...");
      await signOut(auth);
      console.log("✅ Logout successful");
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("❌ Logout failed:", error);
      setError(error.message);
    }
  };

  return (
    <div>
      {auth.currentUser ? (
        <>
          <p>Welcome, {auth.currentUser.displayName}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Sign in with Google</button>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Auth;
