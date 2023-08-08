import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import { onSnapshot, addDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { notesCollection, db } from "./firebase";

export default function App() {
  const [notes, setNotes] = React.useState([]);
  const [currentNoteId, setCurrentNoteId] = React.useState("");
  const [tempNoteText, setTempNoteText] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState("preview");
  const [theme, setTheme] = React.useState(true);
  const themeStyles = {
    backgroundColor: theme ? "#1a1a1a" : "#fff",
    color: theme ? "#fff" : "#1a1a1a",
  };

  const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);

  const currentNote =
    notes.find((note) => note.id === currentNoteId) || notes[0];

  React.useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, function (onSnapshot) {
      const updatedNotes = onSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNotes(updatedNotes);
    });
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id);
    }
  }, [notes]);
  React.useEffect(() => {
    if (currentNote) {
      setTempNoteText(currentNote.body);
    }
  }, [currentNote]);
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (tempNoteText !== currentNote.body) updateNote(tempNoteText);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [tempNoteText]);

  async function createNewNote() {
    const newNote = {
      body: "# Type your markdown note's title here",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const newNoteRef = await addDoc(notesCollection, newNote);
    setCurrentNoteId(newNoteRef.id);
    setSelectedTab("write");
  }

  async function updateNote(text) {
    setTempNoteText(text);
    const noteRef = doc(db, "notes", currentNoteId);
    await setDoc(
      noteRef,
      { body: text, updatedAt: Date.now() },
      { merge: true }
    );
  }

  async function deleteNote(noteId) {
    const noteRef = doc(db, "notes", noteId);
    await deleteDoc(noteRef);
  }
  function handleTabChange() {
    setSelectedTab(selectedTab === "write" ? "preview" : "write");
  }
  function toggleTheme() {
    setTheme((prevTheme) => !prevTheme);
  }

  return (
    <main style={themeStyles}>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={sortedNotes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
            selectedTab={selectedTab}
            toggleTheme={toggleTheme}
            theme={theme}
            setCurrentTab={setSelectedTab}
          />
          <Editor
            tempNoteText={tempNoteText}
            setTempNoteText={setTempNoteText}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
