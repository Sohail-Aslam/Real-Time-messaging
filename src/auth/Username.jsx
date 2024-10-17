/* eslint-disable */
import { useState, useEffect } from "react";
import { auth, db } from "../config/Firebase.js";
import {
  addDoc,
  collection,
  updateDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Username() {
  const [userName, setUserName] = useState("");
  const [userExists, setUserExists] = useState(false);
  const usersRef = collection(db, "user");
  const navigate = useNavigate();

  // Check if the user already exists in Firestore
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const q = query(usersRef, where("userUid", "==", user.uid));

      // Listen for real-time updates
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          setUserExists(true); // User already exists
          const userData = snapshot.docs[0].data();
          setUserName(userData.userName || ""); // Prefill with existing username if available
        } else {
          setUserExists(false); // User does not exist
          addUserUID(user); // Add user UID only if they don't already exist
        }
      });

      // Cleanup listener on unmount
      return () => unsubscribe();
    }
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Add user UID to Firestore if the user does not exist
  const addUserUID = async (user) => {
    try {
      await addDoc(usersRef, {
        userUid: user.uid,
        userName: "", // Initially blank, will update later
      });
      console.log("User UID added successfully!");
    } catch (err) {
      console.error("Error adding user UID: ", err);
    }
  };

  const updateUserName = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const q = query(usersRef, where("userUid", "==", user.uid));

        // Fetch the user's document and update the username
        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const docRef = snapshot.docs[0].ref;

            updateDoc(docRef, {
              userName: userName,
            }).then(() => {
              console.log("Username updated successfully!");
              navigate("/chat"); // Redirect to chat page after updating
            });
          }
        });

        // Cleanup listener
        return () => unsubscribe();
      }
    } catch (err) {
      console.error("Error updating username: ", err);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Username popup */}
      <div className="usernamePopup">
        <h1 className="comment">What's your name?</h1>
        <p style={{ marginLeft: "73px", marginBottom: "120px" }}>
          Adding your name and profile photo helps your teammates recognize and{" "}
          <br />
          connect with you more easily.
        </p>
        <input
          type="text"
          className="popup-input"
          placeholder="Enter User Name..."
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        />
        <button className="popup-btn" onClick={updateUserName}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Username;
