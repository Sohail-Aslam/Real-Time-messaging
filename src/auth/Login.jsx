/* eslint-disable */
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState } from "react";
import { auth } from "../config/Firebase.js";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// console.log(auth.currentUser.email)

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("success");
      navigate("/chat");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <div className="login">
        <h1 className="comment">Sign In to Start Chatting...</h1>{" "}
        <input
          type="text"
          id="editor"
          className="input"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email..."
        />
        <input
          type="password"
          className="input"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password..."
        />
        <button type="submit" className="login-btn" onClick={login}>
          Log In
        </button>
        Not Have An Account <Link to="/signup">SignUp</Link>
      </div>
    </>
  );
}

export default Login;
