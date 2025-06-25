import {
  Button,
  Navbar,
  TextInput,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Dropdown,
  Avatar,
  DropdownHeader,
  DropdownItem,
  DropdownDivider,
} from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import { toggleTheme } from "../redux/theme/themeSlice";
import axios from "axios";
import { HiOutlineUserCircle, HiOutlineLogout } from "react-icons/hi";
import { useState } from "react";

// ✅ Mobile Slider Component
function ThemeSlider({ theme, onToggle }: { theme: string; onToggle: () => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={onToggle}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 dark:peer-focus:ring-indigo-600 rounded-full peer dark:bg-gray-600 peer-checked:bg-indigo-600 transition-all" />
      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition-all" />
    </label>
  );
}

export default function Header() {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state: any) => state.user);
  const { theme } = useSelector((state: any) => state.theme);
  const dispatch = useDispatch();

  const [showSearchBar, setShowSearchBar] = useState(false); // 🔍 state

  const handleSignout = async () => {
    try {
      await axios.post("/api/user/signout", {}, { withCredentials: true });
      dispatch(signoutSuccess());
    } catch (error: any) {
      const errorMessage =
        (error && error.response && error.response.data?.message) ||
        error.message ||
        "Something went wrong";
      console.log(errorMessage);
    }
  };

  return (
    <div className="sticky top-0 left-0 z-50 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-zinc-800/60 transition-all duration-300">
      <Navbar className="!bg-transparent shadow-none text-primary transition-all duration-300">
        {/* 🌟 Logo */}
        <Link
          to="/"
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold"
        >
          <span className="px-2 py-1 rounded-lg text-white !bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Wordnova
          </span>{" "}
          Blog
        </Link>

        {/* 🍔 Right controls */}
        <div className="flex items-center gap-2 md:order-2">
          <NavbarToggle />

          {/* 🔍 Search icon for md+ only */}
          <Button
            className="hidden md:flex w-10 h-10 p-2"
            color="gray"
            pill
            title="Search"
            onClick={() => setShowSearchBar((prev) => !prev)}
          >
            <AiOutlineSearch className="w-5 h-5" />
          </Button>

          {/* 🌗 Normal theme toggle button (desktop only) */}
          <Button
            className="hidden md:flex w-10 h-10 p-2 rounded-full"
            color="gray"
            pill
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? (
              <FaMoon className="w-5 h-5 text-gray-600 dark:text-gray-300" title="Enable dark mode" />
            ) : (
              <FaSun className="w-5 h-5 text-yellow-400" title="Enable light mode" />
            )}
          </Button>

          {/* 👤 Auth dropdown */}
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="User avatar"
                  img={currentUser.profilePicture}
                  rounded
                  className="w-10 h-10 transition duration-150 ring-0 focus:ring-0 hover:ring-0"
                />
              }
              className="z-50 w-56 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <DropdownHeader className="px-4 pt-3 pb-2">
                <div className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                  @{currentUser.username}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {currentUser.email}
                </div>
              </DropdownHeader>

              <div className="px-1">
                <Link to="/dashboard?tab=profile">
                  <DropdownItem className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white transition">
                    <HiOutlineUserCircle className="text-lg text-gray-500 dark:text-gray-400" />
                    Profile
                  </DropdownItem>
                </Link>
              </div>

              <DropdownDivider className="my-1 border-t border-gray-200 dark:border-gray-700" />

              <div className="px-1 pb-2">
                <DropdownItem
                  onClick={handleSignout}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-700 dark:hover:bg-red-700 transition"
                >
                  <HiOutlineLogout className="text-lg" />
                  Sign Out
                </DropdownItem>
              </div>
            </Dropdown>
          ) : (
            <Link to="/signin">
              <Button
                color="purple"
                className="rounded-full px-5 py-2 text-sm font-medium shadow-sm hover:shadow-md transition"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* 📱 Burger Menu Collapse */}
        <NavbarCollapse>
          <NavbarLink active={path === "/"} as={"div"} className="text-primary">
            <Link to="/">Home</Link>
          </NavbarLink>

          <NavbarLink active={path === "/about"} as={"div"} className="text-primary">
            <Link to="/about">About</Link>
          </NavbarLink>

          <NavbarLink active={path === "/projects"} as={"div"} className="text-primary">
            <Link to="/projects">Projects</Link>
          </NavbarLink>

          {/* 🔍 Search input mobile */}
          <form className="block md:hidden w-full mt-3">
            <TextInput
              type="text"
              placeholder="Search..."
              icon={AiOutlineSearch}
              sizing="md"
              className="w-full rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </form>

          {/* 🌗 Slider-based Theme Toggle in mobile */}
          <div className="flex items-center gap-3 mt-4 md:hidden">
            <ThemeSlider theme={theme} onToggle={() => dispatch(toggleTheme())} />
            <span className="text-sm">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
          </div>
        </NavbarCollapse>
      </Navbar>

      {/* 🔍 Floating Search Bar for desktop only */}
      {showSearchBar && (
        <div className="hidden md:block absolute top-20 right-4 z-50 w-72 md:w-96">
          <form className="relative">
            <TextInput
              type="text"
              placeholder="Search..."
              icon={AiOutlineSearch}
              sizing="md"
              autoFocus
              className="w-full rounded-lg shadow-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowSearchBar(false)}
              className="absolute right-3 top-2 text-gray-500 hover:text-red-500"
              title="Close"
            >
              ✕
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
