import Header from "@/components/layout/header";
import React from "react";
import { Toaster } from "sonner";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full bg-white flex flex-1 flex-col h-screen">
      <Toaster richColors />
      <Header />
      <div className="   h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default Layout;
