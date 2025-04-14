import { Link } from "react-router-dom";
import "./../styles/Navbar.css";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  role: string;
  exp?: number;
  iat?: number;
}

export default function Navbar({ onSignOut }: { onSignOut: () => void }) {
  const token = localStorage.getItem("token");
  let isInstructor = false;

  if (token) {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      isInstructor = decoded.role === "instructor";
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }

  return (
<<<<<<< HEAD
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <Link to="/">Home</Link>
          </li>
          <li class="nav-item">
            <Link to="/quizzes">Quizzes</Link>
          </li>
          <li class="nav-item">
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </div>
=======
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/home">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/progress">Progress</Link>
        </li>
        <li className="nav-item">
          <button onClick={onSignOut} className="sign-out-button">
            Sign Out
          </button>
        </li>
        {isInstructor && (
          <li className="nav-item">
            <Link to="/instructor-panel">Instructor Panel</Link>
          </li>
        )}
      </ul>
>>>>>>> google-cloud-firebase-integration
    </nav>
  );
}
