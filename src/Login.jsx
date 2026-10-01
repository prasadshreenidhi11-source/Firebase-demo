import { useState } from "react";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      console.log(
        "Logged in user:",
        userCredential.user
      );

      setMessage("Login successful!");

      // Move to Student Management
      if (onLogin) {
        onLogin();
      }

    } catch (error) {
      console.error("Login error:", error);

      if (
        error.code ===
        "auth/invalid-credential"
      ) {
        setMessage(
          "Invalid email or password"
        );
      } else if (
        error.code ===
        "auth/user-not-found"
      ) {
        setMessage(
          "Account not found. Please create an account."
        );
      } else if (
        error.code ===
        "auth/wrong-password"
      ) {
        setMessage(
          "Incorrect password"
        );
      } else if (
        error.code ===
        "auth/invalid-email"
      ) {
        setMessage(
          "Please enter a valid email"
        );
      } else {
        setMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">

        <h1>Welcome Back</h1>

        <p>
          Login to continue
        </p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {message && (
          <div className="login-message">
            {message}
          </div>
        )}

      </div>
    </div>
  );
}

export default Login;