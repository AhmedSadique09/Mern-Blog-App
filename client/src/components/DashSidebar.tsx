"use client";
import {
  HiAnnotation,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiUser,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
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
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const [tab, setTab] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }

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
      console.log(
        error?.response?.data?.message || error.message || "Signout error"
      );
    }
  };

  const showFullSidebar = isMobile ? isOpen : true;

  return (
    <>
      {/* Hamburger Toggle - Mobile Only */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-20 left-4 p-2 z-40 rounded-md bg-white dark:bg-gray-900 border hover:bg-gray-100 dark:hover:bg-gray-800 shadow-md transition-all"
        title={isOpen ? "Close Sidebar" : "Open Sidebar"}
      >
        <div className="space-y-1">
          <div className="w-5 h-0.5 bg-gray-800 dark:bg-white" />
          <div className="w-5 h-0.5 bg-gray-800 dark:bg-white" />
          <div className="w-5 h-0.5 bg-gray-800 dark:bg-white" />
        </div>
      </button>

      {/* Sidebar Container */}
      <aside
        className={`
          ${
            isMobile
              ? `relative h-screen z-0 bg-primary text-primary transition-all duration-300 ${
                  isOpen ? "translate-x-0" : "-translate-x-full"
                }`
              : "w-64 h-screen bg-primary text-primary"
          }
          border-r border-b border-gray-300 dark:border-gray-700 shadow-md
        `}
      >
        <nav
          className={`flex flex-col ${
            showFullSidebar ? "gap-3 px-5 pt-16" : "gap-5 items-center pt-20 text-xl"
          }`}
        >
          <Link to="/dashboard?tab=profile">
            <div
              className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer group transition-all duration-200 ${
                tab === "profile"
                  ? "bg-gray-800 text-white font-semibold shadow-sm"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-primary hover:text-black dark:hover:text-white"
              }`}
            >
              <HiUser className="text-lg group-hover:scale-105 transition-transform" />
              {showFullSidebar && (
                <span className="text-[15px] flex gap-5">
                  Profile
                  <strong className="bg-gray-700 rounded-md px-1 text-[14px] text-white">
  {currentUser?.isAdmin ? "Admin" : "User"}
</strong>
                </span>
              )}
            </div>
          </Link>

          {currentUser?.isAdmin && (
            <>
              <Link to="/dashboard?tab=posts">
                <div
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer group transition-all duration-200 ${
                    tab === "posts"
                      ? "bg-gray-800 text-white font-semibold shadow-sm"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-primary hover:text-black dark:hover:text-white"
                  }`}
                >
                  <HiDocumentText className="text-lg group-hover:scale-105 transition-transform" />
                  {showFullSidebar && (
                    <span className="text-[15px]">Posts</span>
                  )}
                </div>
              </Link>
              <Link to="/dashboard?tab=users">
                <div
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer group transition-all duration-200 ${
                    tab === "users"
                      ? "bg-gray-800 text-white font-semibold shadow-sm"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-primary hover:text-black dark:hover:text-white"
                  }`}
                >
                  <HiOutlineUserGroup className="text-lg group-hover:scale-105 transition-transform" />
                  {showFullSidebar && (
                    <span className="text-[15px]">Users</span>
                  )}
                </div>
              </Link>
              <Link to="/dashboard?tab=comments">
                <div
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer group transition-all duration-200 ${
                    tab === "comments"
                      ? "bg-gray-800 text-white font-semibold shadow-sm"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-primary hover:text-black dark:hover:text-white"
                  }`}
                >
                  <HiAnnotation className="text-lg group-hover:scale-105 transition-transform" />
                  {showFullSidebar && (
                    <span className="text-[15px]">Comments</span>
                  )}
                </div>
              </Link>
            </>
          )}

          <div
            className="flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer group transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900 text-primary hover:text-red-600 dark:hover:text-red-300"
            onClick={handleSignout}
          >
            <HiArrowSmRight className="text-lg group-hover:scale-105 transition-transform" />
            {showFullSidebar && <span className="text-[15px]">Sign Out</span>}
          </div>
        </nav>
      </aside>
    </>
  );
}
