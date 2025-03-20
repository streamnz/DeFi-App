import api from "../utils/api";

// Note interface definition
export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

// Get all notes
export const getAllNotes = async (): Promise<Note[]> => {
  try {
    const response = await api.get("/api/notes");
    console.log("API Response:", response);
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return [];
  }
};

// Get a single note by ID
export const getNote = async (id: number): Promise<Note | null> => {
  try {
    const response = await api.get(`/api/notes/${id}`);
    return response.data || null;
  } catch (error) {
    console.error("Failed to fetch note details:", error);
    return null;
  }
};

// Create a new note
export const createNote = async (
  note: Omit<Note, "id">
): Promise<Note | null> => {
  try {
    const response = await api.post("/api/notes", note);
    return response.data || null;
  } catch (error) {
    console.error("Failed to create note:", error);
    return null;
  }
};

// Update an existing note
export const updateNote = async (
  id: number,
  note: Partial<Note>
): Promise<Note | null> => {
  try {
    const response = await api.put(`/api/notes/${id}`, note);
    return response.data || null;
  } catch (error) {
    console.error("Failed to update note:", error);
    return null;
  }
};

// Delete a note by ID
export const deleteNote = async (id: number): Promise<boolean> => {
  try {
    const response = await api.delete(`/api/notes/${id}`);
    return response.data?.success || true;
  } catch (error) {
    console.error("Failed to delete note:", error);
    return false;
  }
};
