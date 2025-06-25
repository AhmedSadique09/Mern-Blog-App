"use client";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

export default function DashSidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }

    // Detect mobile screen
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location.search]);

  const handleSignout = async () => {
    try {
      await axios.post("/api/user/signout", {}, { withCredentials: true });
      dispatch(signoutSuccess());
    } catch (error: any) {
      console.log(error?.response?.data?.message || error.message || "Signout error");
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setIsHovered(false);
  };

  const showFullSidebar = isMobile ? isOpen : isHovered;

  return (
    <>
      {/* Hamburger Toggle - Mobile Only (with z-50 fix) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed top-20 left-4 p-2 z-40 md:hidden
          rounded-md bg-white dark:bg-gray-900 border
          hover:bg-gray-100 dark:hover:bg-gray-800 shadow-md transition-all
        `}
        title={isOpen ? "Close Sidebar" : "Open Sidebar"}
      >
        <div className="space-y-1">
          <div className="w-5 h-0.5 bg-gray-800 dark:bg-white" />
          <div className="w-5 h-0.5 bg-gray-800 dark:bg-white" />
          <div className="w-5 h-0.5 bg-gray-800 dark:bg-white" />
        </div>
      </button>

      {/* Sidebar */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          relative top-0 left-0 z-30 h-screen bg-primary text-primary
          border-r border-gray-300 dark:border-gray-700 shadow-md
          transition-all duration-300 ease-in-out
          ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-1"}
          ${!isMobile ? (isHovered ? "md:w-64" : "md:w-16") : "w-64"}
        `}
      >
        {showFullSidebar ? (
          <nav className="flex flex-col gap-3 px-5 pt-18">
            <Link to="/dashboard?tab=profile">
              <div
                className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer group transition-all duration-200 ${
                  tab === "profile"
                    ? "bg-gray-200 dark:bg-gray-800 text-black dark:text-white font-semibold shadow-sm"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-primary hover:text-black dark:hover:text-white"
                }`}
              >
                <HiUser className="text-lg group-hover:scale-105 transition-transform" />
                <span className="text-[15px]">Profile</span>
              </div>
            </Link>

            <div
              className="flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer group transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900 text-primary hover:text-red-600 dark:hover:text-red-300"
              onClick={handleSignout}
            >
              <HiArrowSmRight className="text-lg group-hover:scale-105 transition-transform" />
              <span className="text-[15px]">Sign Out</span>
            </div>
          </nav>
        ) : (
          <nav className="flex flex-col gap-5 items-center pt-20 text-xl text-primary">
            <Link to="/dashboard?tab=profile">
              <HiUser
                title="Profile"
                className={`cursor-pointer hover:text-black dark:hover:text-white ${
                  tab === "profile" ? "text-black dark:text-white" : ""
                }`}
              />
            </Link>
            <HiArrowSmRight
              title="Sign Out"
              onClick={handleSignout}
              className="cursor-pointer hover:text-red-600 dark:hover:text-red-300"
            />
          </nav>
        )}
      </aside>
    </>
  );
}
