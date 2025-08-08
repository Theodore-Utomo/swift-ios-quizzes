import { Link } from "react-router-dom";
import "./../styles/Navbar.css";

export default function Navbar({ onSignOut }: { onSignOut: () => void }) {
  // Get user role from localStorage (new Stytch system)
  const userRole = localStorage.getItem("user_role");
  const isInstructor = userRole === "instructor";

  return (
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
    </nav>
  );
}
