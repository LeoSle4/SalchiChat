import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ChatDashboard from "../pages/ChatDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import UserCreator from "../pages/UserCreator";
import DebugPage from "../pages/DebugPage";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* 🌐 Rutas Públicas */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔒 Rutas Protegidas para CUALQUIER usuario logueado (User o Admin) */}
      <Route element={<ProtectedRoute allowedRoles={["USER", "ADMIN"]} />}>
        <Route path="/chat" element={<ChatDashboard />} />
      </Route>

      {/* 📊 Rutas ÚNICAS para el Administrador */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/debug" element={<DebugPage />} />
        <Route path="/admin/create-user" element={<UserCreator />} />
      </Route>

      {/* 🔄 Redirección de seguridad: Si la ruta no existe, vuelve a la Landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
