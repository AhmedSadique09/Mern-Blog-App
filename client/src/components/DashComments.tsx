import {
  Modal,
  Table,
  Button,
  ModalBody,
  ModalHeader,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  TableHeadCell,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import type { RootState } from '../redux/store';
import axios from 'axios';

interface Comment {
  _id: string;
  content: string;
  numberOfLikes: number;
  postId: string;
  userId: string;
  updatedAt?: string;
}

export default function DashComments() {
  interface CurrentUser {
    _id?: string;
    isAdmin?: boolean;
    // add other properties as needed
  }

  const { currentUser } = useSelector((state: RootState) => state.user) as { currentUser: CurrentUser | null };
  const [comments, setComments] = useState<Comment[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState<string>('');

  useEffect(() => {
  const fetchComments = async () => {
    try {
      const res = await axios.get('/api/comment/getcomments', {
        withCredentials: true, // optional if you're using cookies
      });
      const data = res.data;

      setComments(data.comments);
      if (data.comments.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data?.message || error.message);
      } else {
        console.error('An unexpected error occurred.');
      }
    }
  };

  if (currentUser?.isAdmin) {
    fetchComments();
  }
}, [currentUser?._id]);

const handleShowMore = async () => {
  const startIndex = comments.length;
  try {
    const res = await axios.get(`/api/comment/getcomments?startIndex=${startIndex}`, {
      withCredentials: true,
    });
    const data = res.data;

    setComments((prev) => [...prev, ...data.comments]);
    if (data.comments.length < 9) {
      setShowMore(false);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.message || error.message);
    } else {
      console.error('An unexpected error occurred.');
    }
  }
};

const handleDeleteComment = async () => {
  setShowModal(false);
  try {
    await axios.delete(`/api/comment/deleteComment/${commentIdToDelete}`, {
      withCredentials: true,
    });

    setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.message || error.message);
    } else {
      console.error('An unexpected error occurred.');
    }
  }
};

  return (
  <div className="pt-3 pr-20 md:mx-auto">
    {currentUser?.isAdmin && comments.length > 0 ? (
      <>
        <div className="w-full max-w-6xl overflow-x-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <Table hoverable className="min-w-[600px] rounded-lg border-spacing-0">
            <TableHead className="min-w-[600px] rounded-lg border-spacing-0">
              <TableHeadCell>Date updated</TableHeadCell>
              <TableHeadCell>Comment content</TableHeadCell>
              <TableHeadCell>Number of likes</TableHeadCell>
              <TableHeadCell>PostId</TableHeadCell>
              <TableHeadCell>UserId</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y divide-[hsl(var(--color-placeholder))]">
              {comments.map((comment) => (
                <TableRow
                  key={comment._id}
                  className="!bg-[hsl(var(--color-table-bg))] !text-[hsl(var(--color-table-text))]"
                >
                  <TableCell>
                    {comment.updatedAt
                      ? new Date(comment.updatedAt).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{comment.content}</TableCell>
                  <TableCell>{comment.numberOfLikes}</TableCell>
                  <TableCell>{comment.postId}</TableCell>
                  <TableCell>{comment.userId}</TableCell>
                  <TableCell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
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
      <p>You have no comments yet!</p>
    )}

    <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
      <ModalHeader />
      <ModalBody>
        <div className="text-center">
          <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
          <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this comment?
          </h3>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              color="failure"
              className="bg-red-500 hover:bg-red-700 text-white"
              onClick={handleDeleteComment}
            >
              Yes, I'm sure
            </Button>
            <Button
              className="hover:bg-gray-500"
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
