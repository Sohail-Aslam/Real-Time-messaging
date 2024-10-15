
/* eslint-disable */import { useState } from "react";
import { googleAuth, auth } from "../config/Firebase.js";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { addDoc, collection, updateDoc, getDocs } from "firebase/firestore";
import { db } from "../config/Firebase.js";
import { Link } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  const [isOpen, setIsOpen] = useState(true);

  const userNamePopup = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const usersRef = collection(db, "user");

  const updateUserName = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const querySnapshot = await getDocs(usersRef);

        querySnapshot.forEach(async (doc) => {
          if (doc.data().userUid === user.uid) {
            const docRef = doc.ref;

            await updateDoc(docRef, {
              userName: userName,
            });
            await addUserUID();

            console.log("Username updated successfully!");
          }
        });
      }
    } catch (err) {
      console.error("Error updating username: ", err);
    }
  };

  const SignUp = async () => {
    try {
      userNamePopup();
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err);
    }
  };

  const addUserUID = async () => {
    try {
      await addDoc(usersRef, {
        userUid: auth.currentUser.uid,
        userName: auth.currentUser.displayName,
      });
      console.log("User UID added successfully!");
    } catch (err) {
      console.error("Error adding user UID: ", err);
    }
  };

  return (
    <>
      {/* Username popup */}
      <div
        className="usernamePopup"
        style={{ display: isOpen ? "block" : "none" }}
      >
        <h1
          style={{ marginLeft: "73px", marginBottom: "40px" }}
          className="comment"
        >
          What's your name?
        </h1>
        <p style={{ marginLeft: "73px", marginBottom: "120pxpx" }}>
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
        <button
          className="popup-btn"
          onClick={() => {
            updateUserName();
            userNamePopup();
          }}
        >
          Next
        </button>
      </div>

      {/* Sign-up form */}

      <div className="signup">
        <h1 className="comment">First, Enter Your Email.</h1>
        <input
          type="text"
          className="input"
          placeholder="Email..."
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="input"
          placeholder="Password..."
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* <button type="submit" className="btn" onClick={googleSignin}>
          SignIn with Google
        </button> */}
        <button
          onClick={() => {
            SignUp();
          }}
          type="submit"
          className="login-btn"
        >
          Sign Up
        </button>
        Already Have an account <Link to="/login">LogIn</Link>
      </div>
    </>
  );
}

export default Signup;
