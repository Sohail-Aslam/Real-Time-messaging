/* eslint-disable */
import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../config/Firebase.js";
import SearchUser from "../components/Search.jsx";

function Sidebar({ onSelectUser }) {
  const [user, setUser] = useState([]);
  const [userList, setUserList] = useState([]);

  const usersRef = collection(db, "user");

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = collection(db, "user");
      const data = await getDocs(usersRef);
      const users = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUserList(users);
    };
    fetchUsers();
  }, []);

  return (
    <div className="sidebar">
      <div>
        {userList.map((user) => (
          <div
            className="userli"
            key={user.id}
            onClick={() => onSelectUser(user)}
          >
            <h3 className="user">{user.userName}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
