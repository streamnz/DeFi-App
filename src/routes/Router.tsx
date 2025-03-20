import React, { lazy } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import Loadable from "../components/loadable/Loadable";
import NotesPage from "../components/NotesPage";

const Layout = Loadable(lazy(() => import("../components/layout/Layout")));
const Dashboard = Loadable(lazy(() => import("../views/dashboard/Dashboard")));
const Sell = Loadable(lazy(() => import("../views/sell/Sell")));
const Login = Loadable(lazy(() => import("../views/login/Login")));
const Notfound = Loadable(
  lazy(() => import("../components/errorboundary/404"))
);

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<NotesPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/404" element={<Notfound />} />
        <Route path="*" element={<Navigate to="/auth/404" />} />
      </Route>
    </Routes>
  );
};

export default Router;
