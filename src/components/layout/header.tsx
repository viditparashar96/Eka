import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import HamburgurMenu from "./hamburgurMenu";

export default async function Header() {
  const { userId } = await auth();
  const isAuth = !!userId;
  return (
    <AppBar position="static">
      <div>
        <Toolbar>
          {!isAuth ? null : <HamburgurMenu />}
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Eka
          </Typography>
          {/* 
          <Box
            component="div"
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          >
            {person}
          </Box> */}

          {isAuth ? <UserButton /> : null}
        </Toolbar>
      </div>
    </AppBar>
  );
}
