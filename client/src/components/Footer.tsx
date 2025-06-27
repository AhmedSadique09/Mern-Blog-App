import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { FaGithub, FaFacebook, FaInstagram } from "react-icons/fa";

export default function FooterComp() {
  return (
    <Footer container className="border-t-8 border-teal-500  px-4 py-6 bg-primary text-primary transition-colors duration-300 border-b">
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          <div className="text-center md:text-left">
            <Link
              to="/"
              className="text-2xl sm:text-3xl font-bold"
            >
              <span className="px-3 py-1 rounded-lg text-white !bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                Wordnova
              </span>{" "}
              Blog
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center md:text-left flex-1">
            <div>
              <h2 className="mb-2 text-md font-semibold">About Us</h2>
              <ul className="space-y-1">
                <li><Link to="/about" className="hover:underline">Who We Are</Link></li>
                <li><Link to="/mission" className="hover:underline">Our Mission</Link></li>
                <li><Link to="/team" className="hover:underline">Team</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="mb-2 text-md font-semibold">Support</h2>
              <ul className="space-y-1">
                <li><Link to="/contact" className="hover:underline">Contact</Link></li>
                <li><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:underline">Terms & Conditions</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="mb-2 text-md font-semibold">Follow Us</h2>
              <ul className="space-y-2">
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <FaGithub /> <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <FaFacebook /> <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <FaInstagram /> <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-gray-500 mt-6 pt-4 text-center">
          <span className="text-sm">
            © {new Date().getFullYear()} <Link to="/" className="hover:underline">Wordnova Blog™</Link>. All Rights Reserved.
          </span>
        </div>
      </div>
    </Footer>
  );
}
