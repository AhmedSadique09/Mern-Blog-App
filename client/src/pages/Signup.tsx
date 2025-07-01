import {
  Alert,
  Button,
  Label,
  Spinner,
  TextInput,
  HelperText,
} from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import OAuth from "../components/OAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema
const schema = z.object({
  username: z
    .string()
    .min(8, "Username must be at least 8 characters")
    .max(20, "Username must not exceed 20 characters")
    .regex(/^[^\s]+$/, "Username must not contain spaces"),

  email: z
    .string({ required_error: "Email is required" })
    .min(8, "Email must be at least 8 characters")
    .max(30, "Email must not exceed 30 characters")
    .regex(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Enter a valid email address (e.g., example@domain.com)"
    ),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^[^\s]*$/, "Password must not contain spaces")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

type FormData = z.infer<typeof schema>;

export default function Signup() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.user);

  const [errorMessage, setErrorMessage] = useState("");
  const [Loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // 🔐 Redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate]);

  const onSubmit = async (data: FormData) => {
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/signup", data);
      if (res.data.success === false) {
        return setErrorMessage(res.data.message || "Signup failed.");
      }
      setLoading(false);
      navigate("/signin", { replace: true }); // ✅ prevents back navigation to signup
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || error.message || "Something went wrong."
      );
      setLoading(false);
    }
  };

  const sentence =
    "Unleash your voice. Inspire the world. Sign up and start your blogging journey today.";
  const words = sentence.split(" ");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex p-6 md:p-10 max-w-5xl w-full mx-auto flex-col md:flex-row items-center gap-14">
        {/* Left */}
        <div className="flex-1 text-center md:text-left">
          <Link
            to="/"
            className="text-5xl font-bold text-primary flex flex-col gap-0 md:flex-row md:gap-2 items-center justify-center md:justify-start"
          >
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
          <form
            className="flex flex-col gap-5 text-base"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div>
              <Label htmlFor="username" className="text-primary text-base">
                Your username
              </Label>
              <TextInput
                id="username"
                type="text"
                placeholder="Username"
                {...register("username")}
                color={errors.username ? "failure" : undefined}
                className="text-primary placeholder:text-primary"
              />
              {errors.username && (
                <HelperText color="failure">
                  {errors.username.message}
                </HelperText>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-primary text-base">
                Your email
              </Label>
              <TextInput
                id="email"
                type="email"
                placeholder="name@company.com"
                {...register("email")}
                color={errors.email ? "failure" : undefined}
                className="text-primary placeholder:text-primary"
              />
              {errors.email && (
                <HelperText color="failure">{errors.email.message}</HelperText>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-primary text-base">
                Your password
              </Label>
              <TextInput
                id="password"
                type="password"
                placeholder="Password"
                {...register("password")}
                color={errors.password ? "failure" : undefined}
                className="text-primary placeholder:text-primary"
              />
              {errors.password && (
                <HelperText color="failure">
                  {errors.password.message}
                </HelperText>
              )}
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
              ) : (
                "Sign Up..."
              )}
            </Button>

            <OAuth />
          </form>

          <div className="flex gap-2 text-sm mt-5 text-primary">
            <span>Already have an account?</span>
            <Link to="/signin" className="text-blue-500">
              Sign In
            </Link>
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
