/* eslint-disable react/no-unescaped-entities */
import Sidebar from "@/components/common/sidebar";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
export default function Home() {
  return (
    <div
      className=" h-screen flex relative w-full bg-white"
      style={{ height: "calc(100vh - 100px)" }}
    >
      <Sidebar />
      <div className="flex flex-col items-center justify-center  w-full relative ">
        <div className="mb-8">
          <button className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors duration-300">
            <PlayCircleIcon style={{ fontSize: 50 }} className="text-white" />
          </button>
        </div>
        <p className="text-gray-700 mb-6">Press 'Play' to capture the visit</p>
        <button className="px-6 py-2 bg-primary-500 text-white rounded-md shadow hover:bg-blue-600 transition-colors duration-300">
          Generate Note
        </button>
      </div>
    </div>
  );
}
