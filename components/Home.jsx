import React from "react"
import Sidebar from "./Sidebar"
import Editor from "./Editor"
import Split from "react-split"
import { onSnapshot, addDoc, query, where } from "firebase/firestore"
import { getCollection, updateRecord, deleteRecord } from '../api/api'

export default function Home({ User }) {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState("")
    const [tempNoteText, setTempNoteText] = React.useState("")
    const [selectedTab, setSelectedTab] = React.useState("preview")
    const [theme, setTheme] = React.useState(true)
    const themeStyles = {
        backgroundColor: theme ? "#1a1a1a" : "#fff",
        color: theme ? "#fff" : "#1a1a1a",
        transition: "all 0.5s ease"
    }

    const notesCollection = getCollection("notes");
    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)

    const currentNote =
        notes.find(note => note.id === currentNoteId)
        || notes[0]
        
    /**
     * Sets up a listener for changes to the notes collection in Firestore.
     * Filters documents based on the userId field matching the current user's ID.
     * Updates the state of the notes variable with the updated array of notes.
     * Returns a function that can be called to unsubscribe from the listener.
     */
    React.useEffect(() => {
        const q = query(notesCollection, where("userId", "==", User.uid));
        const unsubscribe = onSnapshot(q, function (onSnapshot) {
            const updatedNotes = onSnapshot.docs.map(doc =>
            (
                {
                    ...doc.data(),
                    id: doc.id
                })
            )
            setNotes(updatedNotes)
        })
        return unsubscribe
    }, [])

    React.useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])
    React.useEffect(() => {
        if (currentNote) {
            setTempNoteText(currentNote.body)
        }
    }, [currentNote])
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (tempNoteText !== currentNote.body)
                updateNote(tempNoteText)
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [tempNoteText])

    // Creates a new note object with default text and adds it to the database
    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            userId: User.uid
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
        setSelectedTab("write")
    }

    // Updates the body of the current note in the database with the new text
    async function updateNote(text) {
        setTempNoteText(text)
        updateRecord("notes", currentNoteId, { body: text, updatedAt: Date.now() }, true)
    }

    // Deletes the note with the given ID from the database
    async function deleteNote(noteId) {
        deleteRecord("notes", noteId)
    }

    // Toggles the selected tab between "write" and "preview"
    function handleTabChange() {
        setSelectedTab(selectedTab === "write" ? "preview" : "write")
    }

    // Toggles the theme between light and dark mode
    function toggleTheme() {
        setTheme(prevTheme => !prevTheme)
    }

    // Renders the main application UI, including the login form, sidebar, and editor
    return (
        <main style={themeStyles}>
            {notes.length > 0
                ?
                <Split
                    sizes={[30, 70]}
                    direction="horizontal"
                    className="split"
                >
                    <Sidebar
                        notes={sortedNotes}
                        currentNote={currentNote}
                        setCurrentNoteId={setCurrentNoteId}
                        newNote={createNewNote}
                        deleteNote={deleteNote}
                        handleTabChange={handleTabChange}
                        selectedTab={selectedTab}
                        toggleTheme={toggleTheme}
                        theme={theme}
                        setSelectedTab={setSelectedTab}
                    />
                    <Editor
                        tempNoteText={tempNoteText}
                        setTempNoteText={setTempNoteText}
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                    />

                </Split>
                :
                <div className="no-notes">
                    <h1>You have no notes</h1>
                    <button
                        className="first-note"
                        onClick={createNewNote}
                    >
                        Create one now
                    </button>
                </div>

            }
        </main>
    )
}
