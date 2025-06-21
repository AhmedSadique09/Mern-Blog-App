import { Button, Navbar, TextInput, NavbarCollapse, NavbarLink, NavbarToggle, Dropdown, Avatar, DropdownHeader, DropdownItem, DropdownDivider } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {signoutSuccess} from '../redux/user/userSlice';
import { toggleTheme } from '../redux/theme/themeSlice';
import axios from 'axios';

export default function Header() {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state: any) => state.user);
  const { theme } = useSelector((state: any) => state.theme);
  const dispatch = useDispatch();

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
    <Navbar className="border-b-2 bg-primary text-primary transition-colors duration-300">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold"
      >
        <span className="px-2 py-1 rounded-lg text-white !bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          Wordnova</span>{" "}
        Blog
      </Link>

      <div className="flex gap-2 md:order-2">
        {/* 🔍 Search icon only for large screens */}
        <Button className="hidden lg:flex w-10 h-10 p-2" color="gray" pill title="Search">
          <AiOutlineSearch className="w-5 h-5" />
        </Button>

        {/* 🌙 Dark mode button only for sm and above */}
        <Button
          className="w-10 h-10 p-2 hidden sm:flex rounded-full"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? (
            <FaMoon className="w-5 h-5" title="Enable dark mode" />
          ) : (
            <FaSun className="w-5 h-5" title="Enable light mode" />
          )}
        </Button>

        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt='user'
                img={currentUser.profilePicture}
                rounded
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate ">{currentUser.email}</span>
            </DropdownHeader>
            <Link to={'/dashboard?tab=profile'}>
              <DropdownItem>Profile</DropdownItem>
            </Link>
            <DropdownDivider />
            <DropdownItem><Link to="/signin" onClick={handleSignout}>Sign out</Link></DropdownItem>

          </Dropdown>
        ) : (
          <Link to="/signin">
            <Button color="purple">Sign In</Button>
          </Link>
        )}

        <NavbarToggle />
      </div>

      {/* 🍔 Burger menu content (for mobile) */}
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

        {/* ✅ Search input field only for mobile */}
        <form className="block md:hidden w-full mt-3">
          <TextInput
            type="text"
            placeholder="Search..."
            icon={AiOutlineSearch}
            sizing="md"
            className="focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg shadow-sm"
          />
        </form>
      </NavbarCollapse>
    </Navbar>
  );
}
