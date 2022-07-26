import React from "react";
import Loading from "../layout/loading/loading";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const UserRoute = ({ children }) => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);

  if (loading) {
    return <Loading />;
  }

  if (isAuthenticated === false) return <Navigate to={"/login"} replace />;

  return children;
};

const AdminRoute = ({ children }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (loading) {
    return <Loading />;
  }

  if (isAuthenticated === false) return <Navigate to={"/login"} replace />;

  if (user?.role === "user") {
    return <Navigate to={"/not_access"} replace />;
  }

  return children;
};

export { UserRoute, AdminRoute };
