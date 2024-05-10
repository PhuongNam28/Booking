import React from "react";
import AdminLayout from "./layout";
import Dashboard from "./page";

const AdminDashboardPage = () => {
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
};

export default AdminDashboardPage;
