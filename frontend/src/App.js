import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AppLayout from "./pages/app/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import Loads from "./pages/app/Loads";
import LoadNew from "./pages/app/LoadNew";
import LoadDetail from "./pages/app/LoadDetail";
import Drivers from "./pages/app/Drivers";
import Documents from "./pages/app/Documents";
import Compliance from "./pages/app/Compliance";
import Financials from "./pages/app/Financials";
import { AuthProvider } from "./lib/auth";
import RequireAuth from "./lib/RequireAuth";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/app"
              element={
                <RequireAuth>
                  <AppLayout />
                </RequireAuth>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="loads" element={<Loads />} />
              <Route path="loads/new" element={<LoadNew />} />
              <Route path="loads/:id" element={<LoadDetail />} />
              <Route path="drivers" element={<Drivers />} />
              <Route path="documents" element={<Documents />} />
              <Route path="compliance" element={<Compliance />} />
              <Route path="financials" element={<Financials />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
