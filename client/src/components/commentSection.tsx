import { Alert, Button, Modal, ModalBody, ModalHeader, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comments';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import axios from 'axios';


interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { currentUser } = useSelector((state: any) => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState<string | null>(null);
  interface CommentType {
    _id: string;
    content: string;
    likes: any[];
    numberOfLikes: number;
    userId: string;
    createdAt: string;
    [key: string]: any;
  }
  const [comments, setComments] = useState<CommentType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await axios.post(
        'http://localhost:3000/api/comment/create',
        {
          content: comment,
          postId,
          userId: currentUser._id,
        },
        {
          withCredentials: true, // for cookies/session
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setComment('');
      setCommentError(null);
      setComments([res.data, ...comments]);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setCommentError(error.response?.data?.message || error.message);
      } else {
        setCommentError('An unexpected error occurred.');
      }
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/comment/getPostComments/${postId}`,
          {
            withCredentials: true,
          }
        );
        setComments(res.data);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data?.message || error.message);
        } else {
          console.log('An unexpected error occurred.');
        }
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId: string) => {
    try {
      if (!currentUser) {
        navigate('/signin');
        return;
      }
      const res = await axios.put(
        `http://localhost:3000/api/comment/likeComment/${commentId}`,
        {},
        { withCredentials: true }
      );
      const data = res.data;
      setComments(
        comments.map((comment) =>
          comment._id === commentId
            ? {
              ...comment,
              likes: data.likes,
              numberOfLikes: data.likes.length,
            }
            : comment
        )
      );
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.message || error.message);
      } else {
        console.log('An unexpected error occurred.');
      }
    }
  };

  const handleEdit = async (comment: { _id: string }, editedContent: string) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
    // You can also update it on the server if needed:
    // await axios.put(`/api/comment/editComment/${comment._id}`, { content: editedContent }, { withCredentials: true });
  };

  const handleDelete = async (commentId: string | null) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate('/signin');
        return;
      }
      await axios.delete(
        `http://localhost:3000/api/comment/deleteComment/${commentId}`,
        {
          withCredentials: true,
        }
      );
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.message || error.message);
      } else {
        console.log('An unexpected error occurred.');
      }
    }
  };
  
  return (
    <div className='max-w-3xl mx-auto w-full p-3'>
      {currentUser ? (
        <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
          <p>Signed in as:</p>
          <img
            className='h-5 w-5 object-cover rounded-full'
            src={currentUser.profilePicture}
            alt=''
          />
          <Link
            to={'/dashboard?tab=profile'}
            className='text-xs text-cyan-600 hover:underline'
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className='text-sm text-teal-500 my-5 flex gap-1'>
          You must be signed in to comment.
          <Link className='text-blue-700 hover:underline' to={'/signin'}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className='border border-teal-500 rounded-md p-3'
        >
          <Textarea
            placeholder='Add a comment...'
            rows={3}
            maxLength={200}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className='flex justify-between items-center mt-5'>
            <p className='text-gray-500 text-xs'>
              {200 - comment.length} characters remaining
            </p>
            <Button outline className="font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg px-6 py-2 shadow-md transition-all duration-300" type='submit'>
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color='failure' className='mt-5'>
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className='text-sm my-5'>No comments yet!</p>
      ) : (
        <>
          <div className='text-sm my-5 flex items-center gap-1'>
            <p>Comments</p>
            <div className='border border-gray-400 py-1 px-2 rounded-sm'>
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId: string) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <ModalHeader />
        <ModalBody>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button
                onClick={() => handleDelete(commentToDelete)}
                className="bg-red-500 hover:bg-red-700 text-white"
              >
                Yes, I'm sure
              </Button>
              <Button
                onClick={() => setShowModal(false)}
                className="hover:bg-gray-500"
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