import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function Navbar({ onSignOut }: { onSignOut: () => void }) {
  const userRole = localStorage.getItem("user_role");
  const isInstructor = userRole === "instructor";

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link to="/home" className="font-semibold tracking-tight">
            Gallaugher's Quizzes
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Button asChild variant="ghost" size="sm">
              <Link to="/home">Home</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/progress">Progress</Link>
            </Button>
            {isInstructor && (
              <Button asChild variant="ghost" size="sm">
                <Link to="/instructor-panel">Instructor Panel</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground md:inline-block">
            {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase() : ""}
          </span>
          <Button onClick={onSignOut} variant="outline" size="sm">
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
}