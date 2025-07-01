import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { Link } from 'react-router-dom';

type User = {
  _id: string;
  username: string;
  profilePicture: string;
};

type Comment = {
  _id: string;
  content: string;
  numberOfLikes: number;
};

type Post = {
  _id: string;
  title: string;
  image: string;
  category: string;
};

export default function DashboardComp() {
  const [users, setUsers] = useState<User[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state: any) => state.user);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getusers?limit=5');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log(error);
        }
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts?limit=5');
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log(error);
        }
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/getcomments?limit=5');
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log(error);
        }
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);
return (
  <div className='min-h-screen flex flex-col items-center justify-center bg-primary text-primary transition-colors p-4 gap-10'>
    {/* Stat Cards */}
    <div className='flex gap-4 justify-center max-w-7xl w-full mb-6'>
      {[{
        title: 'Total Users',
        value: totalUsers,
        icon: <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg' />,
        growth: lastMonthUsers
      }, {
        title: 'Total Comments',
        value: totalComments,
        icon: <HiAnnotation className='bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg' />,
        growth: lastMonthComments
      }, {
        title: 'Total Posts',
        value: totalPosts,
        icon: <HiDocumentText className='bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg' />,
        growth: lastMonthPosts
      }].map(({ title, value, icon, growth }) => (
        <div
          key={title}
          className='flex flex-col p-4 bg-primary text-primary dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md transition-colors border border-black dark:border-gray-700'
        >
          <div className='flex justify-between'>
            <div>
              <h3 className='text-gray-500 text-md uppercase'>{title}</h3>
              <p className='text-2xl'>{value}</p>
            </div>
            {icon}
          </div>
          <div className='flex gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {growth}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
      ))}
    </div>

    {/* Tables Section */}
    <div className='flex flex-wrap gap-4 justify-center max-w-7xl w-full'>

      {/* Recent Users */}
      <div className='flex flex-col w-full md:w-auto shadow-md p-4 rounded-md bg-primary text-primary transition-colors border border-black dark:border-gray-700'>
        <div className='flex justify-between items-center pb-3 text-sm font-semibold'>
          <h1 className='p-2'>Recent users</h1>
          <Link to={'/dashboard?tab=users'}>
            <button className='px-3 py-1 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-600 hover:text-white transition'>
              See all
            </button>
          </Link>
        </div>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-sm'>
            <thead>
              <tr>
                <th className='px-4 py-2 text-left bg-gray-700'>User Image</th>
                <th className='px-4 py-2 text-left bg-gray-700'>Username</th>
              </tr>
            </thead>
            <tbody className='divide-y'>
              {users?.map((user) => (
                <tr key={user._id}>
                  <td className='px-4 py-2'>
                    <img
                      src={user.profilePicture}
                      alt='user'
                      className='w-10 h-10 rounded-full bg-gray-500'
                    />
                  </td>
                  <td className='px-4 py-2'>{user.username}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Comments */}
      <div className='flex flex-col w-full md:w-auto shadow-md p-4 rounded-md bg-primary text-primary transition-colors border border-black dark:border-gray-700'>
        <div className='flex justify-between items-center pb-3 text-sm font-semibold'>
          <h1 className='p-2'>Recent comments</h1>
          <Link to={'/dashboard?tab=comments'}>
            <button className='px-3 py-1 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-600 hover:text-white transition'>
              See all
            </button>
          </Link>
        </div>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-sm'>
            <thead>
              <tr>
                <th className='px-4 py-2 text-left bg-gray-700'>Comment Content</th>
                <th className='px-4 py-2 text-left bg-gray-700'>Likes</th>
              </tr>
            </thead>
            <tbody className='divide-y'>
              {comments?.map((comment) => (
                <tr key={comment._id}>
                  <td className='px-4 py-2 w-96'>
                    <p className='line-clamp-2'>{comment.content}</p>
                  </td>
                  <td className='px-4 py-2'>{comment.numberOfLikes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Posts */}
      <div className='flex flex-col w-full md:w-auto shadow-md p-4 rounded-md bg-primary text-primary transition-colors border border-black dark:border-gray-700'>
        <div className='flex justify-between items-center pb-3 text-sm font-semibold'>
          <h1 className='p-2'>Recent posts</h1>
          <Link to={'/dashboard?tab=posts'}>
            <button className='px-3 py-1 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-600 hover:text-white transition'>
              See all
            </button>
          </Link>
        </div>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-sm'>
            <thead>
              <tr>
                <th className='px-4 py-2 text-left bg-gray-700'>Post Image</th>
                <th className='px-4 py-2 text-left bg-gray-700'>Post Title</th>
                <th className='px-4 py-2 text-left bg-gray-700'>Category</th>
              </tr>
            </thead>
            <tbody className='divide-y'>
              {posts?.map((post) => (
                <tr key={post._id}>
                  <td className='px-4 py-2'>
                    <img
                      src={post.image}
                      alt='post'
                      className='w-14 h-10 rounded-md bg-gray-500'
                    />
                  </td>
                  <td className='px-4 py-2 w-96'>{post.title}</td>
                  <td className='px-4 py-2 w-5'>{post.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
);

}