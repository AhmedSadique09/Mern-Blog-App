import {
  Alert,
  Button,
  Label,
  Spinner,
  TextInput,
  HelperText,
} from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { motion } from "framer-motion";
import OAuth from "../components/OAuth";
import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema
const schema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(8, "Email must be at least 8 characters")
    .max(30, "Email must not exceed 30 characters")
    .regex(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Enter a valid email address (e.g., example@domain.com)"
    ),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters")
    .regex(/^[^\s]*$/, "Password must not contain spaces"),
});

type FormData = z.infer<typeof schema>;

export default function SignIn() {
  const { currentUser, loading, error: errorMessage } = useSelector(
    (state: any) => state.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // ⛔ Redirect to home if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate]);

  const onSubmit = async (formData: FormData) => {
    try {
      dispatch(signInStart());

      const res = await axios.post("/api/auth/signin", formData);
      const data = res.data;

      if (data.success === false) {
        dispatch(signInFailure(data.message));
      } else {
        dispatch(signInSuccess(data));
        navigate("/", { replace: true }); // prevents going back to sign-in
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      dispatch(signInFailure(message));
    }
  };

  const words = [
    "Welcome",
    "to",
    "Wordnova,",
    "your",
    "gateway",
    "to",
    "insightful",
    "blogs",
    "and",
    "creative",
    "writing!",
  ];

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
              <Label htmlFor="email" className="text-primary text-base">
                Your email
              </Label>
              <TextInput
                id="email"
                type="email"
                placeholder="name@company.com"
                {...register("email")}
                color={errors.email ? "failure" : undefined}
                className="text-primary placeholder:text-primary bg-transparent border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 rounded-lg"
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
                placeholder="********"
                {...register("password")}
                color={errors.password ? "failure" : undefined}
                className="text-primary placeholder:text-primary bg-transparent border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 rounded-lg"
              />
              {errors.password && (
                <HelperText color="failure">
                  {errors.password.message}
                </HelperText>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-base"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In..."
              )}
            </Button>
            <OAuth />
          </form>

          <div className="flex gap-2 text-sm mt-5 text-primary">
            <span>Don't have an account?</span>
            <Link to="/signup" className="text-blue-500">
              Sign Up
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
