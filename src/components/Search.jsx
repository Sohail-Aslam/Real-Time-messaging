/* eslint-disable */
import React, { useState } from "react";
import { FiMessageCircle } from "react-icons/fi";

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/Firebase.js";

function SearchUser({ onSelectUser }) {
  const [inputValue, setInputValue] = useState("");
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  // Toggle search result visibility
  const closeSearchBag = () => {
    setIsOpen(!isOpen);
  };

  // Handle search when Enter key is pressed
  const handleSearch = async () => {
    const searchTerm = inputValue.trim();
    if (!searchTerm) {
      setUsers([]); // Clear results if input is empty
      return;
    }

    try {
      const usersRef = collection(db, "user");
      const q = query(usersRef, where("userName", "==", searchTerm));
      const querySnapshot = await getDocs(q);
      const searchResults = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id, // Include the document ID for identification
      }));
      setInputValue("");
      setUsers(searchResults);
    } catch (err) {
      console.error("Error searching for user: ", err);
    }
  };

  // Trigger search when "Enter" key is pressed
  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  // When a user is clicked, select the user and close the search results
  const handleUserClick = (user) => {
    onSelectUser(user); // Pass selected user to the parent
    closeSearchBag(); // Close search results
  };

  return (
    <div className="search-container">
      <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'30px', color:'white', height:'40px', width:'100%'}}>

      <p>
        {" "}
        <FiMessageCircle size={40} />
        Chatter
      </p>
      <input
        className="search"
        type="text"
        placeholder="Search by username..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKey}
        onClick={() => setIsOpen(true)} // Open search results when input is clicked
      />
      </div>

      <div>
        {users.length === 0 ? (
          <p></p>
        ) : (
          users.map((user) => (
            <div
              className="search-bag"
              style={{ display: isOpen ? "block" : "none" }}
              key={user.id}
            >
              <h3
                className="userli"
                onClick={() => handleUserClick(user)} // Handle user click
                style={{ cursor: "pointer" }} // Make it clear it's clickable
              >
                {user.userName}
              </h3>
              <p>{user.email}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SearchUser;
