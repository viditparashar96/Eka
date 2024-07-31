import React from "react";

import { Toaster } from "sonner";
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Toaster richColors />
      {children}
    </div>
  );
};

export default Layout;
