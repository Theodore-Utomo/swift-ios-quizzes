import { Link } from 'react-router-dom';
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
        console.log(isInstructor);
    }

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
                {isInstructor && (
                    <li className="nav-item">
                        <Link to="/instructor-panel">Instructor Panel</Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}
