import { Sidebar } from "@/components/admin/sidebar/sidebar";
import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex">
      <Sidebar />

      {children}
    </section>
  );
};

export default AdminLayout;
