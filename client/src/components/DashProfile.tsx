import { Alert, Button, Modal, ModalBody, ModalHeader, TextInput } from "flowbite-react";
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { updateStart, updateSuccess, updateFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function DashProfile() {
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state: any) => state.user);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({username: "",email: "",password: "",});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "failure" | "">("");
  const [showModel, setShowModel] = useState(false);

  const filePickerRef = useRef<HTMLInputElement | null>(null);

  // Set initial form values
  useEffect(() => {
    setFormData({
      username: currentUser.username || "",
      email: currentUser.email || "",
      password: "",
    });
  }, [currentUser]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isUsernameSame = formData.username === currentUser.username;
    const isEmailSame = formData.email === currentUser.email;
    const isPasswordEmpty = formData.password === "";
    const noImageChange = !imageFile;

    // ✅ 1. No fields changed at all
    if (isUsernameSame && isEmailSame && isPasswordEmpty && noImageChange) {
      setMessage("No changes have been made.");
      setMessageType("failure");
      return;
    }

    // ✅ 2. User didn't enter new username or password
    if ((isUsernameSame && !isPasswordEmpty) || (!isUsernameSame && isPasswordEmpty)) {
      setMessage("No changes detected. Please update your username or password.");
      setMessageType("failure");
      return;
    }

    try {
      dispatch(updateStart());

      const res = await axios.put(
        `/api/user/update/${currentUser._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const data = res.data;
      dispatch(updateSuccess(data));
      setMessage("Profile updated successfully!");
      setMessageType("success");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || "Update failed";

      dispatch(updateFailure(errorMessage));
      setMessage(errorMessage);
      setMessageType("failure");
    }
  };

  const handleDeleteUser = async () => {
   setShowModel(false);
   try {
    dispatch(deleteUserStart());
    const res = await axios.delete(`/api/user/delete/${currentUser._id}`, {
      withCredentials: true,
    });
    const data = res.data;
    dispatch(deleteUserSuccess());
    setMessage(data.message);
    setMessageType("success");
    // Optionally, redirect or clear user state
    setTimeout(() => {
      window.location.href = "/signin"; // Redirect to login page after deletion
    }, 2000);
   } catch (error) {
    dispatch(deleteUserFailure("error.massage"));
   }
  };





  return (
    <div className="max-w-lg mx-auto p-3 w-full bg-primary text-primary transition-colors">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />

        <div
          className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current && filePickerRef.current.click()}
        >
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
          />
        </div>

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          value={formData.username}
          onChange={handleChange}
          className="text-primary"
        />

        <TextInput
          type="email"
          id="email"
          placeholder="email"
          value={formData.email}
          onChange={handleChange}
          className="text-primary"
        />

        <TextInput
          type="password"
          id="password"
          placeholder="password"
          value={formData.password}
          onChange={handleChange}
          className="text-primary"
        />

        <Button
          type="submit"
          className="bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800"
          outline disabled={loading}>
          {loading ? 'Loading...' : 'Update'}
        </Button>

        {
          currentUser.isAdmin && (
            <Link to={"/create-post"}>
            <Button
            type='button'
            className="bg-pink-600 text-white hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600 transition rounded-md px-4 py-2 w-full">
              Create a post
            </Button>
            </Link>
            
          )
        }



        <button
          type="button"
          className="w-[30%] text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-300 font-medium rounded-md text-xs px-5 py-2.5 text-center
         dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
          <span onClick={()=>setShowModel(true)}>Delete Account</span>
        </button>




      </form>

    {messageType === "failure" && message && (
      <Alert className="mt-5" color="failure">
        {message}
      </Alert>
    )}

    

      <Modal
      show={showModel}
      onClose={()=> setShowModel(false)}
      popup
      size='md'>
        <ModalHeader/>
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto "/>
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to delete your account?</h3>
            <div className="flex justify-center gap-4">
              <button
  onClick={handleDeleteUser}
  className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
>
  Yes, I'm sure
</button>


                <Button
  onClick={() => setShowModel(false)}
  className="ml-2 bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
>
  No, cancel
</Button>

                
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
