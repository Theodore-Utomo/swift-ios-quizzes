import React, { useEffect, useState } from "react";
import { API_URL } from "../services/api";

interface ClassOut {
  class_id: string;
  name: string;
}

interface ClassListProps {
  onSelectClass: (id: string, name: string) => void;
  selectedClassId: string | null;
}

const ClassList: React.FC<ClassListProps> = ({ onSelectClass, selectedClassId }) => {
  const [classes, setClasses] = useState<ClassOut[]>([]);
  const [newClassName, setNewClassName] = useState<string>("");
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [editingClassName, setEditingClassName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch classes
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/classes/`);
      if (!res.ok) {
        throw new Error("Failed to fetch classes");
      }
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setError("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Add a new class
  const handleAddClass = async () => {
    if (!newClassName) return;
    try {
      const res = await fetch(`${API_URL}/classes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newClassName }),
      });
      if (!res.ok) throw new Error("Failed to add class");
      await fetchClasses();
      setNewClassName("");
    } catch (error) {
      console.error("Error adding class:", error);
      setError("Failed to add class");
    }
  };

  // Update a class name (assumes PUT endpoint exists at /classes/{class_id})
  const handleUpdateClass = async (classId: string) => {
    if (!editingClassName) return;
    try {
      const res = await fetch(`${API_URL}/classes/${classId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingClassName }),
      });
      if (!res.ok) throw new Error("Failed to update class");
      await fetchClasses();
      setEditingClassId(null);
      setEditingClassName("");
    } catch (error) {
      console.error("Error updating class:", error);
      setError("Failed to update class");
    }
  };

  // Delete a class (assumes DELETE endpoint exists at /classes/{class_id})
  const handleDeleteClass = async (classId: string) => {
    try {
      const res = await fetch(`${API_URL}/classes/${classId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete class");
      await fetchClasses();
      if (selectedClassId === classId) {
        onSelectClass("", "");
      }
    } catch (error) {
      console.error("Error deleting class:", error);
      setError("Failed to delete class");
    }
  };

  if (loading) {
    return <div>Loading classes...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <ul>
        {classes.map((cls) => (
          <li key={cls.class_id} style={{ marginBottom: "10px" }}>
            {editingClassId === cls.class_id ? (
              <>
                <input
                  type="text"
                  value={editingClassName}
                  onChange={(e) => setEditingClassName(e.target.value)}
                />
                <button onClick={() => handleUpdateClass(cls.class_id)}>Save</button>
                <button onClick={() => setEditingClassId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    fontWeight: selectedClassId === cls.class_id ? "bold" : "normal",
                    cursor: "pointer",
                  }}
                  onClick={() => onSelectClass(cls.class_id, cls.name)}
                >
                  {cls.name}
                </span>
                <button onClick={() => {
                  setEditingClassId(cls.class_id);
                  setEditingClassName(cls.name);
                }}>Edit</button>
                <button onClick={() => handleDeleteClass(cls.class_id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div>
        <h3>Add New Class</h3>
        <input
          type="text"
          placeholder="Class Name"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
        />
        <button onClick={handleAddClass}>Add Class</button>
      </div>
    </div>
  );
};

export default ClassList;
