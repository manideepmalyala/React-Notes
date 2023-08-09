import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import Login from "./components/Login"
import { onSnapshot, addDoc, deleteDoc, doc, setDoc } from "firebase/firestore"
import { notesCollection, db } from "./api/firebase"

export default function App() {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState("")
    const [tempNoteText, setTempNoteText] = React.useState("")
    const [selectedTab, setSelectedTab] = React.useState("write")
    const [theme, setTheme] = React.useState(true)
    const [isLoggedIn, setIsLoggedIn] = React.useState(false)
    const themeStyles = {
        backgroundColor: theme ? "#1a1a1a" : "#fff",
        color: theme ? "#fff" : "#1a1a1a",
        transition: "all 0.5s ease"
    }

    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)

    const currentNote =
        notes.find(note => note.id === currentNoteId)
        || notes[0]

    React.useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, function (onSnapshot) {
            const updatedNotes = onSnapshot.docs.map(doc => (
                {
                    ...doc.data(),
                    id: doc.id
                }))
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
            updatedAt: Date.now()
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
        setSelectedTab("write")
    }

    // Updates the body of the current note in the database with the new text
    async function updateNote(text) {
        setTempNoteText(text)
        const noteRef = doc(db, "notes", currentNoteId)
        await setDoc(noteRef, { body: text, updatedAt: Date.now() }, { merge: true })
    }

    // Deletes the note with the given ID from the database
    async function deleteNote(noteId) {
        const noteRef = doc(db, "notes", noteId)
        await deleteDoc(noteRef)

    }

    // Toggles the selected tab between "write" and "preview"
    function handleTabChange() {
        setSelectedTab(selectedTab === "write" ? "preview" : "write")
    }

    // Toggles the theme between light and dark mode
    function toggleTheme() {
        setTheme(prevTheme => !prevTheme)
    }

    // Toggles the sign up form
    function signUp() {
        setIsSigningUp(prevState => !prevState)
    }

    // Renders the main application UI, including the login form, sidebar, and editor
    return (
        <main style={themeStyles}>
            {
                !isLoggedIn ?
                    <Login setIsLoggedIn={setIsLoggedIn} /> :
                    notes.length > 0
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
                            />
                            <Editor
                                tempNoteText={tempNoteText}
                                setTempNoteText={setTempNoteText}
                                selectedTab={selectedTab}
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
