import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./middleware/ProtectedRoute";
import Home from "./pages/Home";
import CreateTask from "./pages/CreateTask";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import TaskHistory from "./components/TaskHistory";

function App() {
  const [open, setOpen] = useState(true);

  return (
    <div>
      {/* sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      <div className={`${open ? "ml-80 md:ml-80 w-[calc(100vw-22.5rem)]" : "ml-8"} transition-all duration-300`}>
        {/* Navbar */}
        <Navbar open={open} />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home title={"Beranda"} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history-task/:id"
            element={
              <ProtectedRoute>
                <TaskHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task"
            element={
              <ProtectedRoute>
                <CreateTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Random Path */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
