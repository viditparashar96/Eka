"use client";
import { loginUser } from "@/services/actions/user.action";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await loginUser(formData);
      console.log("result===>", result);
    } catch (error: any) {
      console.log("error===>", error);
      if (error.response) {
        toast.error(error.response.data.error);
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center bg-white"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="w-full max-w-[400px] p-8 space-y-4  rounded ">
        <h2 className="text-xl font-semibold text-center">Welcome Back</h2>
        <button className="w-full px-4 py-2 font-semibold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none">
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21.35 11.1h-9.7V13.6h5.5c-.3 1.2-.9 2.2-1.8 2.9l2.8 2.2c1.7-1.6 2.7-3.9 2.7-6.5c0-.4 0-.9-.1-1.3z"
              />
              <path
                fill="currentColor"
                d="M12.15 21.1c2.3 0 4.2-.8 5.6-2.1l-2.8-2.2c-.7.5-1.6.8-2.8.8c-2.2 0-4.1-1.5-4.8-3.5H5.55v2.2c1.3 2.5 4 4.3 7 4.3z"
              />
              <path
                fill="currentColor"
                d="M7.35 14c-.2-.5-.3-1.1-.3-1.7s.1-1.2.3-1.7V8.4H5.55c-.7 1.3-1.1 2.7-1.1 4.3s.4 3 1.1 4.3l1.8-1.4z"
              />
              <path
                fill="currentColor"
                d="M12.15 6.5c1.3 0 2.4.4 3.3 1.3l2.5-2.5c-1.4-1.3-3.3-2.1-5.8-2.1c-3-0-5.7 1.8-7 4.3l1.8 1.4c.8-2 2.7-3.4 4.8-3.4z"
              />
            </svg>
            Sign in with Google
          </span>
        </button>
        <div className="flex items-center justify-center my-4">
          <hr className="w-full border-gray-300" />
          <span className="px-3 text-gray-500">OR</span>
          <hr className="w-full border-gray-300" />
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              id="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-sm focus:outline-none   bg-transparent focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
          >
            Sign in
          </button>
        </form>
        <div className=" text-center">
          <Link href="#" className="text-sm text-blue-500 hover:underline">
            Forgot your password?
          </Link>
        </div>

        <div className=" text-center">
          <Link
            href="/register"
            className="text-sm text-blue-500 hover:underline"
          >
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
