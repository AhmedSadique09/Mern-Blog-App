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
import { useNavigate } from 'react-router-dom';

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
  }

  const { currentUser } = useSelector(
    (state: RootState) => state.user
  ) as { currentUser: CurrentUser | null };

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser?.isAdmin) {
      navigate('/notFound'); // Redirect if not admin
    }
  }, [currentUser, navigate]);

  const [comments, setComments] = useState<Comment[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState<string>('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get('/api/comment/getcomments', {
          withCredentials: true,
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
      const res = await axios.get(
        `/api/comment/getcomments?startIndex=${startIndex}`,
        { withCredentials: true }
      );
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

      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentIdToDelete)
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data?.message || error.message);
      } else {
        console.error('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="pt-3 px-4 sm:px-8 md:px-20 overflow-x-hidden">
      {currentUser?.isAdmin && comments.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:flex justify-center w-full">
            <div className="w-full max-w-6xl overflow-x-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <Table hoverable className="min-w-[600px] rounded-lg border-spacing-0">
                <TableHead>
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
          </div>

          {/* Mobile Card Layout */}
          <div className="block md:hidden space-y-4 py-15">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800"
              >
                <div className="text-sm text-gray-500 mb-2">
                  {comment.updatedAt
                    ? new Date(comment.updatedAt).toLocaleDateString()
                    : 'N/A'}
                </div>
                <div className="mb-2">
                  <p className="text-gray-800 dark:text-gray-100 font-medium">
                    Content:
                  </p>
                  <p className="text-sm break-words text-gray-700 dark:text-gray-300">
                    {comment.content}
                  </p>
                </div>
                <div className="mb-1 text-sm text-gray-600 dark:text-gray-300">
                  <strong>Likes:</strong> {comment.numberOfLikes}
                </div>
                <div className="mb-1 text-sm text-gray-600 dark:text-gray-300">
                  <strong>Post ID:</strong> {comment.postId}
                </div>
                <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                  <strong>User ID:</strong> {comment.userId}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setShowModal(true);
                      setCommentIdToDelete(comment._id);
                    }}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
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
        <p className="text-sm mt-4">You have no comments yet!</p>
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
