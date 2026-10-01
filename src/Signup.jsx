import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import "./Signup.css";

function Signup({ onVerified }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  // STEP 1: Create Firebase account + send OTP
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // Create Firebase account
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Send OTP through our backend
      const response = await fetch(
        "http://localhost:5000/api/auth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to send OTP"
        );
      }

      setOtpSent(true);
      setMessage("OTP sent to your email!");
    } catch (error) {
      console.error("Signup error:", error);

      if (error.code === "auth/email-already-in-use") {
        setMessage("This email is already registered");
      } else if (error.code === "auth/weak-password") {
        setMessage("Password must be at least 6 characters");
      } else if (error.code === "auth/invalid-email") {
        setMessage("Please enter a valid email");
      } else {
        setMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp) {
      setMessage("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      setMessage("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "OTP verification failed"
        );
      }

      setMessage("Email verified successfully!");

      // Move to Student Management
      if (onVerified) {
        onVerified();
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-box">

        {!otpSent ? (
          <>
            <h1>Create Account</h1>

            <p>
              Create your account to continue
            </p>

            <form onSubmit={handleSignup}>
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

              <button type="submit" disabled={loading}>
                {loading
                  ? "Sending OTP..."
                  : "Create Account"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1>Verify Your Email</h1>

            <p>
              We sent a 6-digit verification code to
            </p>

            <strong>{email}</strong>

            <form onSubmit={handleVerifyOTP}>
              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(/\D/g, "")
                  )
                }
              />

              <button type="submit" disabled={loading}>
                {loading
                  ? "Verifying..."
                  : "Verify OTP"}
              </button>
            </form>
          </>
        )}

        {message && (
          <div className="signup-message">
            {message}
          </div>
        )}

      </div>
    </div>
  );
}

export default Signup;