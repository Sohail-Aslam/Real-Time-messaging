/* eslint-disable */
import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/Firebase.js";

function SearchUser({ onSelectUser }) {
  const [inputValue, setInputValue] = useState("");
  const [users, setUsers] = useState([]);

  const handleSearch = async () => {
    const searchTerm = inputValue.trim();
    if (!searchTerm) return;

    try {
      console.log("Searching for:", searchTerm);

      const usersRef = collection(db, "user");
      const q = query(usersRef, where("userName", "==", searchTerm));

      const querySnapshot = await getDocs(q);
      const searchResults = querySnapshot.docs.map((doc) => doc.data());
      setUsers(searchResults);

      console.log("Search results:", searchResults);
    } catch (err) {
      console.error("Error searching for user: ", err);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <input
        className="search"
        type="text"
        placeholder="Search by username..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKey}
      />
      <div>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          users.map((user, index) => (
            <div key={index}>
              <h3 onClick={() => onSelectUser(user)}>{user.userName}</h3>
              <p>{user.email}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SearchUser;
