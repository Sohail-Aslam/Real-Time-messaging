/* eslint-disable */ 

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Signup from "./auth/Signup.jsx";
import Login from "./auth/Login.jsx";
import Chat from "./Chat.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { auth } from "./config/Firebase.js";
import "./App.css";
import { FiLogOut } from "react-icons/fi";
import Username from "./auth/Username.jsx";

function App() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <Router>
      <div className="home">
        <div className="container">
          <FiLogOut
            style={{
              fontSize: "30px",
              color: "white",
              position: "relative",
              bottom: "-808px",
              right: "-5px",
            }}
            onClick={logOut}
          />
          <Sidebar onSelectUser={setSelectedUser} />
          <Routes>
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  {selectedUser && <Chat selectedUser={selectedUser} />}
                </PrivateRoute>
              }
            />
            <Route path="/username" element={<Username />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
