import { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";
import "./App.css";

function StudentManagement({ onLogout }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [course, setCourse] = useState("");

  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [searchName, setSearchName] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [showStudents, setShowStudents] = useState(false);

  const fetchStudents = async (
    courseFilter = "",
    nameFilter = ""
  ) => {
    try {
      let url = "http://localhost:5000/api/students";

      const params = new URLSearchParams();

      if (courseFilter) {
        params.append("course", courseFilter);
      }

      if (nameFilter) {
        params.append("name", nameFilter);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const studentList = await response.json();

      setStudents(studentList);
    } catch (error) {
      console.error(
        "Error fetching students:",
        error
      );

      setMessage("Unable to load students");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !age || !course) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      if (editingId) {
        const response = await fetch(
          `http://localhost:5000/api/students/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              age,
              course,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to update student"
          );
        }

        setMessage("Updated!");
        setEditingId(null);
      } else {
        const response = await fetch(
          "http://localhost:5000/api/students",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              age,
              course,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to add student"
          );
        }

        setMessage("Added!");
      }

      setName("");
      setAge("");
      setCourse("");

      await fetchStudents();

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error(
        "Error saving student:",
        error
      );

      setMessage("Something went wrong");
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setName(student.name);
    setAge(student.age);
    setCourse(student.course);
    setShowStudents(true);
  };

  const handleDelete = async (studentId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${studentId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete student"
        );
      }

      setMessage("Deleted!");

      await fetchStudents();

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error(
        "Error deleting student:",
        error
      );

      setMessage("Something went wrong");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setAge("");
    setCourse("");
  };

  const handleShowStudents = async () => {
    const newState = !showStudents;

    setShowStudents(newState);

    if (newState) {
      await fetchStudents();
    }
  };

  return (
    <div className="app">

      {/* TOP BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={onLogout}
          style={{
            background: "#e53935",
            color: "white",
            padding: "10px 18px",
            borderRadius: "6px",
          }}
        >
          Log Out
        </button>
      </div>

      <h1>Student Management</h1>

      {/* NAME SEARCH */}
      <div className="name-search-container">
        <input
          type="text"
          placeholder="Search student name..."
          value={searchName}
          onChange={(e) =>
            setSearchName(e.target.value)
          }
        />

        <button
          className="search-button"
          onClick={async () => {
            await fetchStudents(
              "",
              searchName
            );

            setShowStudents(true);
          }}
        >
          Search
        </button>
      </div>

      {/* ADD / UPDATE STUDENT */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter student name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Enter age"
          value={age}
          onChange={(e) =>
            setAge(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Enter course"
          value={course}
          onChange={(e) =>
            setCourse(e.target.value)
          }
        />

        <button type="submit">
          {editingId
            ? "Update Student"
            : "Add Student"}
        </button>

        {editingId && (
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </form>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {/* VIEW STUDENTS */}
      <button
        className="view-students-button"
        onClick={handleShowStudents}
      >
        {showStudents
          ? "Hide Added Students"
          : "View Added Students"}
      </button>

      {/* COURSE FILTER */}
      <div className="course-filter-container">
        <select
          className="course-filter"
          value={selectedCourse}
          onChange={(e) =>
            setSelectedCourse(e.target.value)
          }
        >
          <option value="">
            Select Course
          </option>

          <option value="BBA">
            BBA
          </option>

          <option value="BCA">
            BCA
          </option>

          <option value="BCOM">
            BCOM
          </option>

          <option value="BE">
            BE
          </option>
        </select>

        <button
          className="search-button"
          onClick={() => {
            fetchStudents(
              selectedCourse
            );

            setShowStudents(true);
          }}
        >
          Search
        </button>
      </div>

      {/* STUDENT LIST */}
      {showStudents && (
        <div className="students-section">

          <h2>
            Added Students
          </h2>

          {students.length === 0 ? (
            <p>
              No students found.
            </p>
          ) : (
            <div className="student-list">

              {students.map(
                (student) => (
                  <div
                    className="student-card"
                    key={student.id}
                  >

                    <h3>
                      {student.name}
                    </h3>

                    <p>
                      Age: {student.age}
                    </p>

                    <p>
                      Course:{" "}
                      {student.course}
                    </p>

                    <div className="student-actions">

                      <button
                        onClick={() =>
                          handleEdit(
                            student
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(
                            student.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
}


function App() {

  const [screen, setScreen] =
    useState("signup");

  if (screen === "signup") {
    return (
      <div>
        <Signup
          onVerified={() =>
            setScreen("student")
          }
        />

        <div
          style={{
            textAlign: "center",
            marginTop: "-20px",
          }}
        >
          <button
            onClick={() =>
              setScreen("login")
            }
            style={{
              background: "transparent",
              color: "#4f46e5",
              cursor: "pointer",
            }}
          >
            Already have an account?
            Login
          </button>
        </div>
      </div>
    );
  }


  if (screen === "login") {
    return (
      <div>
        <Login
          onLogin={() =>
            setScreen("student")
          }
        />

        <div
          style={{
            textAlign: "center",
            marginTop: "-20px",
          }}
        >
          <button
            onClick={() =>
              setScreen("signup")
            }
            style={{
              background: "transparent",
              color: "#4f46e5",
              cursor: "pointer",
            }}
          >
            Don't have an account?
            Create Account
          </button>
        </div>
      </div>
    );
  }


  return (
    <StudentManagement
      onLogout={() =>
        setScreen("login")
      }
    />
  );
}

export default App;