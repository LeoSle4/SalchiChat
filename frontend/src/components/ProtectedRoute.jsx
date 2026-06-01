import { Navigate, Outlet } from "react-router-dom";

// Este componente envuelve las páginas que requieren permisos especiales
const ProtectedRoute = ({ allowedRoles }) => {
  // Recuperamos la información de las llaves ofuscadas
  const token = localStorage.getItem("_sk1");
  const role = localStorage.getItem("_sk2");

  const user = {
    isAuthenticated: !!token,
    role: role || "USER",
  };

  if (!user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Si no es Admin, lo mandamos al chat común por seguridad
    return <Navigate to="/chat" replace />;
  }

  // Si todo está bien, renderiza la página interna (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
