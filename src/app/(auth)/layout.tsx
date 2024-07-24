import Header from "@/components/layout/header";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full bg-white h-screen">
      <Header />
      {children}
    </div>
  );
};

export default Layout;
