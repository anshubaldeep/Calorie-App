import React from "react"
import "./App.css"
import { Route, Routes, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Form from "./components/LoginForm"
import Home from "./containers/Home"
import Admin from "./containers/Admin"
import "react-toastify/dist/ReactToastify.css"

function App() {
  return (
    <div className="App">
      <nav className="App-header">Calories App</nav>
      <Routes>
        <Route
          path="/login"
          element={<Form title="Login" label="Login Form 🔑" />}
        />
        <Route
          path="/register"
          element={<Form title="Register" label="Register Form 📙" />}
        />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
