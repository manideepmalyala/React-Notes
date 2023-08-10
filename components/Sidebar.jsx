import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons"


export default function Sidebar(props) {
    const noteElements = props.notes.map((note, index) => (
        <div key={note.id}>
            <div

                className={`title ${note.id === props.currentNote.id ? "selected-note" : ""
                    }`}
                onClick={() => {
                    props.setCurrentNoteId(note.id);
                    props.setSelectedTab("preview");

                }}
            >
                <h4 className="text-snippet">{note.body.split("\n")[0]}</h4>
                <small className={`updated-at ${note.id === props.currentNote.id ? "selected-note" : ""
                    }`}>
                    {new Date(note.updatedAt).toLocaleString()}
                </small>
                <button
                    className="delete-btn"
                    onClick={() => props.deleteNote(note.id)}
                >
                    <i className="gg-trash trash-icon"></i>
                </button>
            </div>
        </div>
    ))

    return (
        <section className="pane sidebar">
            <div className="sidebar--header">
                <h3>Notes</h3>
                <button className="new-note" onClick={props.newNote}>+</button>
                <div onClick={props.toggleTheme}>

                    {props.theme ? <FontAwesomeIcon icon={faMoon} /> :
                        <FontAwesomeIcon icon={faSun} />}
                </div>
            </div>
            {noteElements}
        </section>
    )
}
