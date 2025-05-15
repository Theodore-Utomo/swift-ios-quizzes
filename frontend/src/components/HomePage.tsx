import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/HomePage.css";
export const API_URL = import.meta.env.VITE_API_URL;

interface ClassOut {
  class_id: string;
  name: string;
}

const HomePage: React.FC = () => {
  const [classes, setClasses] = useState<ClassOut[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch(`${API_URL}classes/`);
        if (!res.ok) {
          throw new Error("Failed to fetch classes");
        }
        const data = await res.json();
        setClasses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleClassClick = (classId: string) => {
    navigate(`/class/${classId}`);
  };

  if (loading) return <p>Loading classes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="homepage-container">
      <h1>Available Courses</h1>
      <ul>
        {classes.map((cls) => (
          <li key={cls.class_id} onClick={() => handleClassClick(cls.class_id)}>
            {cls.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
