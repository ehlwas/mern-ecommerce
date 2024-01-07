import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = ({ decodedToken }) => {
  return decodedToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes