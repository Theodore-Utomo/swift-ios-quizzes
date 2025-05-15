import React, { useEffect, useState } from "react";
export const API_URL = import.meta.env.VITE_API_URL;

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

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const res = await fetch(`${API_URL}classes/`);
      if (!res.ok) throw new Error("Failed to fetch classes");
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Add a new class
  const handleAddClass = async () => {
    if (!newClassName) return;
    try {
      const res = await fetch("http://127.0.0.1:8000/classes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newClassName }),
      });
      if (!res.ok) throw new Error("Failed to add class");
      await fetchClasses();
      setNewClassName("");
    } catch (error) {
      console.error(error);
    }
  };

  // Update a class name (assumes PUT endpoint exists at /classes/{class_id})
  const handleUpdateClass = async (classId: string) => {
    if (!editingClassName) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/classes/${classId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingClassName }),
      });
      if (!res.ok) throw new Error("Failed to update class");
      await fetchClasses();
      setEditingClassId(null);
      setEditingClassName("");
    } catch (error) {
      console.error(error);
    }
  };

  // Delete a class (assumes DELETE endpoint exists at /classes/{class_id})
  const handleDeleteClass = async (classId: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/classes/${classId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete class");
      await fetchClasses();
      if (selectedClassId === classId) {
        onSelectClass("", "");
      }
    } catch (error) {
      console.error(error);
    }
  };

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
