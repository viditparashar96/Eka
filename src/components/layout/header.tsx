"use client";
import { patientsList } from "@/constants";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import Avatar from "../avatar";

const StyledSearch = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.main, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const person = (
  <PersonIcon style={{ scale: 2 }} className=" cursor-pointer text-white" />
);

export default function Header() {
  const [open, setState]: any = useState(false);
  const [patients, setPatients] = useState(patientsList);
  const [search, setSearch] = useState("");
  const handleSeach = (e: any) => {
    setSearch(e.target.value);
    setPatients(
      patientsList.filter((patient) =>
        patient.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };
  const toggleDrawer: any = (open: any) => (event: any) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState(open);
  };

  return (
    <AppBar position="static">
      <div>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Vidit Parashar
          </Typography>

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
          </Box>

          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(true)}
            sx={{
              mr: 2,
              display: {
                xs: "block",
                sm: "none",
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Drawer
            anchor="right"
            open={open}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
          >
            <Box
              sx={{
                p: 2,
                height: 1,
                backgroundColor: "#fff",
                width: 250,
              }}
            >
              <IconButton sx={{ mb: 2 }}>
                <CloseIcon onClick={toggleDrawer(false)} />
              </IconButton>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <button className="w-full px-4 py-2 mb-4 text-primary-500 font-semibold bg-blue-100 rounded">
                  START A NEW VISIT
                </button>
                <div className=" flex items-center justify-between mb-4 ">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search Notes..."
                      className="w-full px-4 py-2 pr-10 border rounded"
                      onChange={handleSeach}
                      value={search}
                    />
                    <div className="absolute top-0 right-0 flex items-center h-full pr-3">
                      <SearchIcon className=" text-gray-500 cursor-pointer" />
                    </div>
                  </div>
                  <FilterAltIcon className="text-gray-500 cursor-pointer" />
                </div>

                <div className="space-y-2">
                  {patients.map((patient, index) => (
                    <Avatar key={index} patient={patient} />
                  ))}
                </div>
              </Box>

              {person}
            </Box>
          </Drawer>
        </Toolbar>
      </div>
    </AppBar>
  );
}
