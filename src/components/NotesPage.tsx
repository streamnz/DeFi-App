import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Note,
  createNote,
  deleteNote,
  getAllNotes,
  updateNote,
} from "../api/notes";

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const notesList = await getAllNotes();
      setNotes(notesList);
      setError(null);
    } catch (err) {
      setError("Failed to load notes");
      console.error("Error loading notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEditingNote(null);
    setTitle("");
    setContent("");
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      if (editingNote) {
        await updateNote(editingNote.id, { title, content });
        setSuccess("Note updated successfully");
      } else {
        await createNote({ title, content });
        setSuccess("Note created successfully");
      }
      handleClose();
      loadNotes();
    } catch (err) {
      setError(editingNote ? "Failed to update note" : "Failed to create note");
      console.error("Error saving note:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      setLoading(true);
      await deleteNote(id);
      setSuccess("Note deleted successfully");
      loadNotes();
    } catch (err) {
      setError("Failed to delete note");
      console.error("Error deleting note:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h4" component="h1">
          Notes Manager
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          disabled={loading}
        >
          New Note
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
        }}
      >
        {notes.map((note) => (
          <Card
            key={note.id}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 4,
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="h6" component="h2" noWrap>
                  {note.title}
                </Typography>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(note)}
                    disabled={loading}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(note.id)}
                    disabled={loading}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  whiteSpace: "pre-wrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {note.content}
              </Typography>
              {note.updatedAt && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 2, display: "block" }}
                >
                  Last updated: {new Date(note.updatedAt).toLocaleString()}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingNote ? "Edit Note" : "New Note"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            error={!title.trim() && title !== ""}
            helperText={
              !title.trim() && title !== "" ? "Title is required" : ""
            }
          />
          <TextField
            margin="normal"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            error={!content.trim() && content !== ""}
            helperText={
              !content.trim() && content !== "" ? "Content is required" : ""
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loading || !title.trim() || !content.trim()}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NotesPage;
