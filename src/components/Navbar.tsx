import { Link } from 'react-router-dom';
import "./../styles/Navbar.css";

interface NavigationBarProps {
    onSignOut: () => void;
}

export default function Navbar({ onSignOut }: NavigationBarProps) {
    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li className="nav-item">
                    <Link to="/">Home</Link>
                </li>
                <li className="nav-item">
                    <Link to="/quizzes">Quizzes</Link>
                </li>
                <li className="nav-item">
                    <Link to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                    <button onClick={onSignOut} className="sign-out-button">
                        Sign Out
                    </button>
                </li>
            </ul>
        </nav>
    );
}
