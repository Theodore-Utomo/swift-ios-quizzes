import "./../styles/Navbar.css";

export default function NavigationBar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/home" className="home">
            Home
          </Link>
        </li>
        <li>
          <a href="#">Quizzes</a>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
    </nav>
  );
}
