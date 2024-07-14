import { Patient } from "@/types";
import { Add } from "@mui/icons-material";
import Link from "next/link";

interface PatientSubHeaderProps {
  foundedUser: Patient | undefined;
}
const PatientSubHeader = ({ foundedUser }: PatientSubHeaderProps) => {
  return (
    <div className=" p-4 px-10 border-b-2 border-b-gray-300 flex items-center justify-between md:flex-row flex-col">
      <h1 className=" text-2xl font-semibold ">{foundedUser?.name}</h1>
      <div className=" flex gap-4  md:flex-row flex-col w-[80%] md:w-fit">
        <Link
          href={"/"}
          className="w-full px-4 py-2  text-primary-500  bg-blue-100 rounded text-center"
        >
          All Notes
        </Link>
        <button className="w-full px-4 py-2 items-center justify-center  text-primary-500  bg-blue-100 rounded flex whitespace-nowrap">
          <Add />
          Follow Up
        </button>
      </div>
    </div>
  );
};

export default PatientSubHeader;
