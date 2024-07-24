import React from 'react'

const page = () => {
  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-rose-100 to-green-100"
    style={{ height: "calc(100vh - 64px)" }}

    >
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
        <button className="w-full px-4 py-2 font-semibold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none">
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M21.35 11.1h-9.7V13.6h5.5c-.3 1.2-.9 2.2-1.8 2.9l2.8 2.2c1.7-1.6 2.7-3.9 2.7-6.5c0-.4 0-.9-.1-1.3z"/>
              <path fill="currentColor" d="M12.15 21.1c2.3 0 4.2-.8 5.6-2.1l-2.8-2.2c-.7.5-1.6.8-2.8.8c-2.2 0-4.1-1.5-4.8-3.5H5.55v2.2c1.3 2.5 4 4.3 7 4.3z"/>
              <path fill="currentColor" d="M7.35 14c-.2-.5-.3-1.1-.3-1.7s.1-1.2.3-1.7V8.4H5.55c-.7 1.3-1.1 2.7-1.1 4.3s.4 3 1.1 4.3l1.8-1.4z"/>
              <path fill="currentColor" d="M12.15 6.5c1.3 0 2.4.4 3.3 1.3l2.5-2.5c-1.4-1.3-3.3-2.1-5.8-2.1c-3-0-5.7 1.8-7 4.3l1.8 1.4c.8-2 2.7-3.4 4.8-3.4z"/>
            </svg>
            Sign in with Google
          </span>
        </button>
        <div className="flex items-center justify-center my-4">
          <hr className="w-full border-gray-300"/>
          <span className="px-3 text-gray-500">OR</span>
          <hr className="w-full border-gray-300"/>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="email">Email</label>
            <input type="email" id="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <input type="password" id="password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
          </div>
          <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none">
            Sign in
          </button>
        </form>
        <div className="text-center">
          <a href="#" className="text-sm text-blue-500 hover:underline">Forgot your password?</a>
        </div>
        <div className="text-center">
          <a href="#" className="text-sm text-blue-500 hover:underline">Don't have an account? Sign up</a>
        </div>
      </div>
    </div>
  )
}

export default page