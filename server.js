import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";
import db from "./firebaseAdmin.js";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());


// =====================================================
// SEND 6-DIGIT EMAIL OTP
// =====================================================

app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // OTP expires after 5 minutes
    const expiresAt = Date.now() + 5 * 60 * 1000;

    console.log("OTP generated for:", email);
    console.log("Expires at:", new Date(expiresAt));

    // Temporary OTP storage
    global.otpStore = global.otpStore || {};

    global.otpStore[email] = {
      otp,
      expiresAt,
    };

    // Send email
    const { data, error } = await resend.emails.send({
      from: "noreply@spike.com",
      to: email,
      subject: "Your Verification Code",
      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 500px;
          margin: auto;
          padding: 30px;
          text-align: center;
        ">

          <h2>Email Verification</h2>

          <p>
            Your verification code is:
          </p>

          <h1 style="
            letter-spacing: 8px;
            font-size: 36px;
          ">
            ${otp}
          </h1>

          <p>
            This code will expire in 5 minutes.
          </p>

          <p>
            If you did not request this code,
            you can ignore this email.
          </p>

        </div>
      `,
    });

    if (error) {
  console.error("========== RESEND ERROR ==========");
  console.error(error);
  console.error("=================================");

  return res.status(500).json({
    message: error.message || "Failed to send verification email",
  });
}

    console.log("Email sent:", data);

    res.json({
      message: "Verification code sent successfully",
    });

  } catch (error) {
    console.error("OTP error:", error);

    res.status(500).json({
      message: "Failed to send OTP",
      error: error.message,
    });
  }
});


// =====================================================
// VERIFY 6-DIGIT EMAIL OTP
// =====================================================

app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const storedData = global.otpStore?.[email];

    // No OTP found
    if (!storedData) {
      return res.status(400).json({
        message:
          "No verification code found. Please request a new code.",
      });
    }

    // Check expiration
    if (Date.now() > storedData.expiresAt) {
      delete global.otpStore[email];

      return res.status(400).json({
        message:
          "Verification code has expired. Please request a new code.",
      });
    }

    // Check OTP
    if (storedData.otp !== otp.trim()) {
      return res.status(400).json({
        message: "Invalid verification code",
      });
    }

    // OTP is correct
    delete global.otpStore[email];

    console.log("Email verified:", email);

    res.json({
      message: "Email verified successfully",
      verified: true,
    });

  } catch (error) {
    console.error("OTP verification error:", error);

    res.status(500).json({
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
});


// =====================================================
// GET - Get students
// Supports:
// /api/students
// /api/students?course=BCA
// /api/students?name=Spike
// /api/students?course=BCA&name=Spike
// =====================================================

app.get("/api/students", async (req, res) => {
  try {
    const { course, name } = req.query;

    let query = db.collection("students");

    // Filter by course in Firestore
    if (course) {
      query = query.where("course", "==", course);
    }

    const snapshot = await query.get();

    let students = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Search student name
    if (name && name.trim()) {
      const searchName = name.trim().toLowerCase();

      students = students.filter((student) =>
        String(student.name || "")
          .trim()
          .toLowerCase()
          .includes(searchName)
      );
    }

    console.log("Name search:", name);
    console.log("Students returned:", students.length);

    res.json(students);

  } catch (error) {
    console.error("Error getting students:", error);

    res.status(500).json({
      message: "Failed to fetch students",
      error: error.message,
    });
  }
});


// =====================================================
// POST - Add student
// =====================================================

app.post("/api/students", async (req, res) => {
  try {
    const { name, age, course } = req.body;

    if (!name || !age || !course) {
      return res.status(400).json({
        message: "Please provide name, age, and course",
      });
    }

    const studentRef = await db
      .collection("students")
      .add({
        name,
        age,
        course,
      });

    res.status(201).json({
      id: studentRef.id,
      name,
      age,
      course,
    });

  } catch (error) {
    console.error("Error adding student:", error);

    res.status(500).json({
      message: "Failed to add student",
      error: error.message,
    });
  }
});


// =====================================================
// DELETE - Delete student
// =====================================================

app.delete("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db
      .collection("students")
      .doc(id)
      .delete();

    res.json({
      message: "Student deleted successfully",
      id,
    });

  } catch (error) {
    console.error("Error deleting student:", error);

    res.status(500).json({
      message: "Failed to delete student",
      error: error.message,
    });
  }
});


// =====================================================
// PUT - Update student
// =====================================================

app.put("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, course } = req.body;

    if (!name || !age || !course) {
      return res.status(400).json({
        message: "Please provide name, age, and course",
      });
    }

    const studentRef = db
      .collection("students")
      .doc(id);

    await studentRef.update({
      name,
      age,
      course,
    });

    res.json({
      id,
      name,
      age,
      course,
    });

  } catch (error) {
    console.error("Error updating student:", error);

    res.status(500).json({
      message: "Failed to update student",
      error: error.message,
    });
  }
});


// =====================================================
// START SERVER
// =====================================================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `Server running at http://localhost:${PORT}`
  );
});