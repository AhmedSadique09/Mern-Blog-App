"use client";

import {
  HiAnnotation,
  HiArrowSmRight,
  HiChartPie,
  HiDocumentText,
  HiOutlineUserGroup,
  HiUser,
  HiX,
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
  const [showHamburger, setShowHamburger] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) setTab(tabFromUrl);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location.search]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setShowHamburger(false);
      } else {
        setShowHamburger(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleSignout = async () => {
    try {
      await axios.post("/api/user/signout", {}, { withCredentials: true });
      dispatch(signoutSuccess());
    } catch (error: any) {
      console.log(error?.response?.data?.message || error.message || "Signout error");
    }
  };

  const showFullSidebar = isMobile ? isOpen : true;

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden fixed top-20 left-4 p-2 z-30 rounded-md bg-white dark:bg-gray-900 border hover:bg-gray-100 dark:hover:bg-gray-800 shadow-md transition-all duration-300 ${
            showHamburger ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          title={isOpen ? "Close Sidebar" : "Open Sidebar"}
        >
          <div className="space-y-1">
            <div className="w-5 h-0.5 bg-gray-800 dark:bg-white" />
            <div className="w-5 h-0.5 bg-gray-800 dark:bg-white" />
            <div className="w-5 h-0.5 bg-gray-800 dark:bg-white" />
          </div>
        </button>
      )}

      <aside
        className={`${
          isMobile
            ? `fixed top-15 left-0 h-full w-64 bg-primary text-primary transform transition-transform duration-500 ease-in-out z-40 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : "w-64 h-screen bg-primary text-primary fixed top-0 left-0 z-40"
        } border-r border-gray-300 dark:border-gray-700 shadow-md`}
      >
        {isMobile && isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close Sidebar"
            className="absolute top-4 right-4 z-50 p-2 rounded-full transition-colors"
          >
            <HiX className="text-2xl" style={{ color: "hsl(var(--color-icon))" }} />
          </button>
        )}

        <nav
          className={`flex flex-col ${
            showFullSidebar
              ? "gap-3 px-10 pt-18 lg:pt-24 xl:pt-28"
              : "gap-5 items-center pt-20 text-xl"
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

          {/* Only show below options if user is Admin */}
          {currentUser?.isAdmin && (
            <>
              <Link to="/dashboard?tab=dash">
                <div
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer group transition-all duration-200 ${
                    tab === "dash"
                      ? "bg-gray-800 text-white font-semibold shadow-sm"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-primary hover:text-black dark:hover:text-white"
                  }`}
                >
                  <HiChartPie className="text-lg group-hover:scale-105 transition-transform" />
                  {showFullSidebar && <span className="text-[15px]">Dashboard</span>}
                </div>
              </Link>

              <Link to="/dashboard?tab=posts">
                <div
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer group transition-all duration-200 ${
                    tab === "posts"
                      ? "bg-gray-800 text-white font-semibold shadow-sm"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-primary hover:text-black dark:hover:text-white"
                  }`}
                >
                  <HiDocumentText className="text-lg group-hover:scale-105 transition-transform" />
                  {showFullSidebar && <span className="text-[15px]">Posts</span>}
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
                  {showFullSidebar && <span className="text-[15px]">Users</span>}
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
                  {showFullSidebar && <span className="text-[15px]">Comments</span>}
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
