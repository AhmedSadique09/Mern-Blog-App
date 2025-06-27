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
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import axios from 'axios';

interface RootState {
  user: {
    currentUser: {
      _id: string;
      isAdmin: boolean;
    };
  };
}

type Post = {
  _id: string;
  slug: string;
  image: string;
  title: string;
  category: string;
  updatedAt: string;
};

export default function DashPosts() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState<string>('');

 useEffect(() => {
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token'); // Replace with Redux if needed
      const res = await axios.get(`/api/post/getposts?userId=${currentUser._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;
      setUserPosts(data.posts);

      if (data.posts.length < 9) {
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
    fetchPosts();
  }
}, [currentUser._id]);

// 👇 Load more posts
const handleShowMore = async () => {
  const startIndex = userPosts.length;
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(
      `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = res.data;
    setUserPosts((prev) => [...prev, ...data.posts]);

    if (data.posts.length < 9) {
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

// 👇 Delete a post
const handleDeletePost = async () => {
  setShowModal(false);
  try {
    const token = localStorage.getItem('token');
    const res = await axios.delete(
      `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUserPosts((prev) =>
      prev.filter((post) => post._id !== postIdToDelete)
    );
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


  return (
   <div className="pt-3 pr-20 md:mx-auto">
  {currentUser.isAdmin && userPosts.length > 0 ? (
    <>
      <div className="w-full max-w-6xl overflow-x-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <Table
          hoverable
          className="min-w-[600px] rounded-lg border-spacing-0"
        >
          <TableHead className="min-w-[600px] rounded-lg border-spacing-0">
            <TableHeadCell>Date updated</TableHeadCell>
            <TableHeadCell>Post image</TableHeadCell>
            <TableHeadCell>Post title</TableHeadCell>
            <TableHeadCell>Category</TableHeadCell>
            <TableHeadCell>Delete</TableHeadCell>
            <TableHeadCell>
              <span>Edit</span>
            </TableHeadCell>
          </TableHead>

          {userPosts.map((post) => (
            <TableBody key={post._id} className="divide-y divide-[hsl(var(--color-placeholder))]">
              <TableRow className="!bg-[hsl(var(--color-table-bg))] !text-[hsl(var(--color-table-text))]">
                <TableCell>
                  {new Date(post.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Link to={`/post/${post.slug}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-20 h-10 object-cover bg-gray-500 rounded-md"
                    />
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    className="font-medium !text-[hsl(var(--color-table-text))]"
                    to={`/post/${post.slug}`}
                  >
                    {post.title}
                  </Link>
                </TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>
                  <span
                    onClick={() => {
                      setShowModal(true);
                      setPostIdToDelete(post._id);
                    }}
                    className="font-medium text-red-500 hover:underline cursor-pointer"
                  >
                    Delete
                  </span>
                </TableCell>
                <TableCell>
                  <Link
                    className="text-green-600 hover:underline"
                    to={`/update-post/${post._id}`}
                  >
                    <span>Edit</span>
                  </Link>
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
    <p>You have no posts yet!</p>
  )}

  <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
    <ModalHeader />
    <ModalBody>
      <div className="text-center">
        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
          Are you sure you want to delete this post?
        </h3>
        <div className="flex justify-center gap-4">
          <Button
  color="failure"
  className="!bg-red-600 dark:!bg-red-500 hover:!bg-red-700 dark:hover:!bg-red-600 text-white"
  onClick={handleDeletePost}
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
