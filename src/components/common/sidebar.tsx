"use client";
import { getPatientsbyPhysician } from "@/services/actions/patient.action";
import { setPatients } from "@/store/patientsSlice";
import { Patient } from "@/types";
import { useAuth } from "@clerk/nextjs";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../avatar";
const Sidebar = () => {
  const patients = useSelector((state: any) => state.patients.patients);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { userId } = useAuth();
  const handleSeach = (e: any) => {
    setSearch(e.target.value);
    setPatients(
      patients.filter((patient: Patient) =>
        patient.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const result = await getPatientsbyPhysician(userId as string);
        console.log("result===>", result);
        if (result.patients) {
          dispatch(setPatients(result.patients));
          setLoading(false);
        }
      } catch (error) {
        console.log("error while getting Patients===>", error);
        setLoading(false);
      }
    })();
  }, [userId, dispatch]);

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
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <CircularProgress />
          </div>
        ) : (
          <>
            {patients.map((patient: Patient, index: number) => (
              <Avatar key={index} patient={patient} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
