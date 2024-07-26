import FloatingButton from "@/components/common/floatingButton";
import Header from "@/components/layout/header";

import React from "react";
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" " style={{ height: "calc(100vh - 64px)" }}>
      <Header />
      <main className="w-full ">{children}</main>
      <FloatingButton />
    </div>
  );
};

export default Layout;
