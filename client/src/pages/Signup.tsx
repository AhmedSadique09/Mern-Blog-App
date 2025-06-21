import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import OAuth from "../components/OAuth";

export default function Signup() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: { target: { id: string; value: string } }) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const sentence = "Unleash your voice. Inspire the world. Sign up and start your blogging journey today.";
  const words = sentence.split(" ");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!formData.username || !formData.email || !formData.password) {
      setLoading(false);
      return setErrorMessage("Please fill out all fields.");
    }

    try {
      const res = await axios.post("/api/auth/signup", formData);
      if (res.data.success === false) {
        return setErrorMessage(res.data.message || "Signup failed.");
      }
      setLoading(false);
      navigate("/Signin");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || error.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex p-6 md:p-10 max-w-5xl w-full mx-auto flex-col md:flex-row items-center gap-14">
        {/* Left */}
        <div className="flex-1 text-center md:text-left">
  <Link to="/" className="text-5xl font-bold text-primary flex flex-col gap-0 md:flex-row md:gap-2 items-center justify-center md:justify-start">
    <span className="px-3 py-2 !bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg">
      Wordnova
    </span>
    <span className="text-primary">Blog</span>
  </Link>

          <motion.p
            className="text-primary text-base mt-6 md:max-w-sm flex flex-wrap mx-auto md:mx-0"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.07 },
              },
            }}
          >
            {words.map((word, index) => (
              <motion.span
                key={index}
                className="mr-1"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.p>
        </div>

        {/* Right */}
        <div className="flex-1 w-full">
          <form className="flex flex-col gap-5 text-base" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="username" className="text-primary text-base">Your username</Label>
              <TextInput
                id="username"
                type="text"
                placeholder="Username"
                onChange={handleChange}
                className="text-primary placeholder:text-primary"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-primary text-base">Your email</Label>
              <TextInput
                id="email"
                type="email"
                placeholder="name@company.com"
                onChange={handleChange}
                className="text-primary placeholder:text-primary"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-primary text-base">Your password</Label>
              <TextInput
                id="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                className="text-primary placeholder:text-primary"
              />
            </div>

            <Button
              type="submit"
              disabled={Loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-base"
            >
              {Loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : "Sign Up..."}
            </Button>
            <OAuth />
          </form>

          <div className="flex gap-2 text-sm mt-5 text-primary">
            <span>Already have an account?</span>
            <Link to="/signin" className="text-blue-500">Sign In</Link>
          </div>

          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
