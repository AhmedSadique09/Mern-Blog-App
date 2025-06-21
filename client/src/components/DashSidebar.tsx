"use client";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {signoutSuccess} from '../redux/user/userSlice';
import { useDispatch } from "react-redux";
import axios from 'axios';



export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
  try {
    await axios.post('/api/user/signout', {}, {
      withCredentials: true, // 🔑 if you're using cookies
    });

    dispatch(signoutSuccess());
  } catch (error: any) {
    const errorMessage =
      (error && error.response && error.response.data?.message) ||
      error.message ||
      'Something went wrong';

    console.log(errorMessage);
  }
};

 return (
    <aside className="w-full md:w-56 bg-primary text-primary h-screen transition-colors p-4 border-2">
      <nav className="flex flex-col gap-2">
        {/* Profile Tab */}
        <Link to="/dashboard?tab=profile">
          <div
            className={`flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition-colors
              ${
                tab === 'profile'
                  ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-primary'
              }`}
          >
            <HiUser className="text-xl" />
            <span className="text-sm font-medium">Profile</span>
          </div>
        </Link>

        {/* Sign Out */}
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition-colors
          hover:bg-gray-100 dark:hover:bg-gray-800 text-primary"
          onClick={handleSignout}
        >
          <HiArrowSmRight className="text-xl" />
          <span className="text-sm font-medium">Sign Out</span>
        </div>
      </nav>
    </aside>
  );
}