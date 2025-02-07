import { Link } from "react-router-dom";
import "./../styles/Navbar.css";

export default function NavigationBar() {
  return (
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
    </nav>
  );
}
