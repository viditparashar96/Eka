import Header from "@/components/layout/header";
import React from "react";
import { Toaster } from "sonner";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full bg-white h-screen">
      <Toaster richColors />
      <Header />
      {children}
    </div>
  );
};

export default Layout;
