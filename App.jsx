import React, { createContext } from "react"
import Home from "./components/Home";
import Login from "./components/Login";

export default function App() {
    const [User, setUser] = React.useState({ email: "", uid: "" })
    const [isLoggedIn, setIsLoggedIn] = React.useState(false)
    const [theme, setTheme] = React.useState('light')
    const themeStyles = {
        backgroundColor: theme ? "#1a1a1a" : "#fff",
        color: theme ? "#fff" : "#1a1a1a",
        transition: "all 0.5s ease"
    }
    // Renders the main application UI, including the login form, sidebar, and editor
    return (
        <div style={themeStyles}>
            {
                !isLoggedIn ?
                    <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} /> : User?.uid.length > 0 && <Home User={User} />
            }
        </div>
    )
}
