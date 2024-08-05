import { Patient } from "@/types";
import Link from "next/link";

export interface AvatarProps {
  patient: Patient;
}
const Avatar = ({ patient }: AvatarProps) => {
  return (
    <Link href={`/patient/${patient.id}`} className=" bg-gray-200 rounded ">
      <div className="flex items-center p-2 rounded">
        <div className="flex items-center justify-center w-8 h-8 mr-2 text-white bg-blue-600 rounded-full">
          {patient.name.charAt(0)}
        </div>
        <span>{patient.name}</span>
      </div>
    </Link>
  );
};

export default Avatar;
