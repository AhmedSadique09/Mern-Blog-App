import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';
import axios from 'axios';

interface CommentProps {
  comment: {
    _id: string;
    userId: string;
    content: string;
    createdAt: string;
    likes: string[];
    numberOfLikes: number;
  };
  onLike: (commentId: string) => void;
  onEdit: (comment: any, editedContent: string) => void;
  onDelete: (commentId: string) => void;
}

interface User {
  _id?: string;
  username?: string;
  profilePicture?: string;
}

export default function Comment({ comment, onLike, onEdit, onDelete }: CommentProps) {
  const [user, setUser] = useState<User>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector((state: any) => state.user);

  useEffect(() => {
  const getUser = async () => {
    try {
      const res = await axios.get(`/api/user/${comment.userId}`, {
        withCredentials: true, // only needed if using cookies/session
      });
      setUser(res.data);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.message || error.message);
      } else {
        console.log('An unexpected error occurred.');
      }
    }
  };
  getUser();
}, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
  try {
    const res = await axios.put(
      `/api/comment/editComment/${comment._id}`,
      {
        content: editedContent,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // only if your backend uses cookies
      }
    );

    if (res.status === 200) {
      setIsEditing(false);
      onEdit(comment, editedContent);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data?.message || error.message);
    } else {
      console.log('An unexpected error occurred.');
    }
  }
};

  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        <img
          className='w-10 h-10 rounded-full bg-gray-200'
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className='flex-1'>
        <div className='flex items-center mb-1'>
          <span className='font-bold mr-1 text-xs truncate'>
            {user ? `@${user.username}` : 'anonymous user'}
          </span>
          <span className='text-gray-500 text-xs'>
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className='mb-2'
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className='flex justify-end gap-2 text-xs'>
              <Button
                type='button'
                size='sm'
                className="text-white font-bold py-2 px-4 rounded bg-green-500 hover:bg-green-700"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type='button'
                size='sm'
                className="text-white font-bold py-2 px-4 rounded bg-red-500 hover:bg-red-700"
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className='text-gray-500 pb-2'>{comment.content}</p>
            <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
              <button
                type='button'
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  '!text-blue-500'
                }`}
              >
                <FaThumbsUp className='text-sm' />
              </button>
              <p className='text-gray-400'>
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    ' ' +
                    (comment.numberOfLikes === 1 ? 'like' : 'likes')}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type='button'
                      onClick={handleEdit}
                      className='text-gray-400 hover:text-blue-500'
                    >
                      Edit
                    </button>
                    <button
                      type='button'
                      onClick={() => onDelete(comment._id)}
                      className='text-gray-400 hover:text-red-500'
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}