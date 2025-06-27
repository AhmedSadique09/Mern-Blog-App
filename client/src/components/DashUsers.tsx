import {
  Modal,
  Table,
  Button,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  TableHeadCell,
  ModalHeader,
  ModalBody,
} from 'flowbite-react';
import { useEffect, useState, type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import axios from 'axios';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface RootState {
  user: {
    currentUser: {
      _id: string;
      isAdmin: boolean;
    };
  };
}

type Post = {
  isAdmin: any;
  email: ReactNode;
  username: ReactNode;
  profilePicture: string | undefined;
  createdAt: string | number | Date;
  _id: string;
  slug: string;
  image: string;
  title: string;
  category: string;
  updatedAt: string;
};

export default function DashUsers() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [users, setUsers] = useState<Post[]>([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/user/getusers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;
        setUsers(data.users);

        if (data.users.length < 9) {
          setShowMore(false);
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data?.message || error.message);
        } else if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log('Unknown error:', error);
        }
      }
    };

    if (currentUser?.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `/api/user/getusers?startIndex=${startIndex}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;
      setUsers((prev) => [...prev, ...data.users]);

      if (data.users.length < 9) {
        setShowMore(false);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.message || error.message);
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log('Unknown error:', error);
      }
    }
  };

  const handleDeleteUser = async () => {
    const isDeletingSelf = userIdToDelete === currentUser._id;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setShowModal(false);

        if (isDeletingSelf) {
          localStorage.removeItem('token');
          document.cookie = 'access_token=; Max-Age=0';
          navigate('/signup'); // redirect to signup or login
        } else {
          setUsers((prev) =>
            prev.filter((user) => user._id !== userIdToDelete)
          );
        }
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error instanceof Error ? error.message : error);
    }
  };

  return (
    <div className="pt-3 pr-20 md:mx-auto">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <div className="w-full max-w-6xl overflow-x-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <Table
              hoverable
              className="min-w-[600px] rounded-lg border-spacing-0"
            >
              <TableHead className="min-w-[600px] rounded-lg border-spacing-0">
                <TableHeadCell>Date created</TableHeadCell>
                <TableHeadCell>Post image</TableHeadCell>
                <TableHeadCell>Username</TableHeadCell>
                <TableHeadCell>Email</TableHeadCell>
                <TableHeadCell>Admin</TableHeadCell>
                <TableHeadCell>Delete</TableHeadCell>
              </TableHead>

              {users.map((user) => (
                <TableBody
                  key={user._id}
                  className="divide-y divide-[hsl(var(--color-placeholder))]"
                >
                  <TableRow className="!bg-[hsl(var(--color-table-bg))] !text-[hsl(var(--color-table-text))]">
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <img
                        src={user.profilePicture}
                        alt={
                          typeof user.username === 'string'
                            ? user.username
                            : ''
                        }
                        className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                      />
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.isAdmin ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setUserIdToDelete(user._id);
                        }}
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))}
            </Table>
          </div>

          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-emerald-600 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no users yet!</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
              {userIdToDelete === currentUser._id
                ? 'You are about to delete your own admin account!'
                : 'Are you sure you want to delete this user?'}
            </h3>
            {userIdToDelete === currentUser._id && (
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                This action will sign you out and remove your admin access
                permanently. Please confirm only if you are absolutely sure.
              </p>
            )}
            <div className="flex justify-center gap-4 mt-4">
              <Button
                color="failure"
                className="!bg-red-600 dark:!bg-red-500 hover:!bg-red-700 dark:hover:!bg-red-600 text-white"
                onClick={handleDeleteUser}
              >
                Yes, I'm sure
              </Button>
              <Button
                className="!bg-transparent hover:!bg-gray-200 dark:hover:!bg-gray-700 text-gray-700 dark:text-gray-300 border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                onClick={() => setShowModal(false)}
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
