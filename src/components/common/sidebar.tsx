"use client";
import { patientsList } from "@/constants";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import Avatar from "../avatar";
const Sidebar = () => {
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
  return (
    <div
      className="w-74 p-4   border-r-2 border-gray-200 overflow-y-auto sm:block hidden"
      style={{ height: "calc(100vh - 64px)" }}
    >
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
    </div>
  );
};

export default Sidebar;
