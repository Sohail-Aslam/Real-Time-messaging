/* eslint-disable */
import { useState } from "react";
import { auth } from "../config/Firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const SignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      navigate("/username");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
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
        <button onClick={SignUp} type="submit" className="login-btn">
          Sign Up
        </button>
        Already Have an account <Link to="/login">LogIn</Link>
      </div>
    </>
  );
}

export default Signup;
