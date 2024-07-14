import Header from "@/components/layout/header";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import React from "react";
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <main style={{ minHeight: "calc(100vh - 100px)" }}>{children}</main>
      <div className="fixed bottom-16 right-16">
        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </div>
    </div>
  );
};

export default Layout;
