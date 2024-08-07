import { formatDateTime } from "@/lib/utils";
import { Patient } from "@/types";
import Link from "next/link";
export interface AvatarProps {
  patient: Patient;
}
const Avatar = ({ patient }: AvatarProps) => {
  return (
    <Link
      href={`/patient/${patient.id}`}
      className=" bg-gray-200 rounded py-1 "
    >
      <div className="flex items-center p-2 rounded">
        <div className="flex items-center justify-center  w-8 h-8 mr-2 text-white bg-blue-600 rounded-full">
          {patient.name.charAt(0)}
        </div>
        <div>
          <span>{patient.name}</span>
          <div>
            <p className="text-[11px]">{formatDateTime(patient.visitDay)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Avatar;
