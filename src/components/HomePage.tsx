import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        const res = await fetch("http://127.0.0.1:8000/classes/");
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
    // Navigate to the class's quiz page (e.g. /class/<classId>)
    navigate(`/class/${classId}`);
  };

  if (loading) return <p>Loading classes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Available Courses</h1>
      <ul>
        {classes.map((cls) => (
          <li
            key={cls.class_id}
            style={{ cursor: "pointer", marginBottom: "10px", color: "blue" }}
            onClick={() => handleClassClick(cls.class_id)}
          >
            {cls.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
