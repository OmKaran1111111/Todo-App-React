import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import "./App.css";
import Home from './Pages/home'
import Search_task from './Pages/search'
import AddTask from './Pages/AddTask'
import LoginForm from "./Pages/Login";
import TaskList from "./Pages/TaskList";
import Dashboard from "./Pages/Dashboard";

const AppContent = () => {
  return (
    <>
      <SignedIn>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search_task />} />
          <Route path="/addtask" element={<AddTask />} />
          <Route path="/tasklist" element={<TaskList />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </SignedIn>
      <SignedOut>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
          <LoginForm/>
        </div>
      </SignedOut>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;