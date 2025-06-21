import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import { motion } from 'framer-motion';
import OAuth from '../components/OAuth';
import axios from 'axios';

export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loading, error: errorMessage } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: { target: { id: any; value: string } }) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }

    try {
      dispatch(signInStart());

      const res = await axios.post('/api/auth/signin', formData);
      const data = res.data;

      if (data.success === false) {
        dispatch(signInFailure(data.message));
      } else {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || 'Something went wrong';
      dispatch(signInFailure(message));
    }
  };

  const words = [
    "Welcome", "to", "Wordnova,", "your", "gateway", "to", "insightful", "blogs", "and", "creative", "writing!"
  ];

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
              <Label htmlFor="email" className="text-primary text-base">Your email</Label>
              <TextInput
                id="email"
                type="email"
                placeholder="name@company.com"
                onChange={handleChange}
                className="text-primary placeholder:text-primary bg-transparent border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 rounded-lg"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-primary text-base">Your password</Label>
              <TextInput
                id="password"
                type="password"
                placeholder="********"
                onChange={handleChange}
                className="text-primary placeholder:text-primary bg-transparent border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 rounded-lg"
              />
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
              ) : "Sign In..."}
            </Button>
            <OAuth />
          </form>

          <div className="flex gap-2 text-sm mt-5 text-primary">
            <span>Don't have an account?</span>
            <Link to="/signup" className="text-blue-500">Sign Up</Link>
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
