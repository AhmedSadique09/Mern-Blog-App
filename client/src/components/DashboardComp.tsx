import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';

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
        console.error(error);
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
        console.error(error);
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
        console.error(error);
      }
    };

    if (currentUser?.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

// ✅ Restrict access if user is not admin
const navigate = useNavigate();
useEffect(() => {
  if (!currentUser?.isAdmin) {
    navigate("/notFound"); 
  }
}, [currentUser, navigate]);

  if (!currentUser?.isAdmin) {
    return null; 
  }

  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col items-center justify-center bg-primary text-primary transition-colors py-18 gap-6 sm:gap-10 px-4 sm:px-10">
      {/* Stat Cards */}
      <div className="flex flex-col md:flex-row gap-4 justify-center max-w-6xl w-full">
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
            className="flex flex-col p-4 bg-primary text-primary dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md border border-black dark:border-gray-700"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="text-gray-500 text-md uppercase">{title}</h3>
                <p className="text-2xl font-semibold">{value}</p>
              </div>
              {icon}
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiArrowNarrowUp />
                {growth}
              </span>
              <div className="text-gray-500">Last month</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tables */}
      <div className="flex flex-wrap gap-4 justify-center max-w-7xl w-full">
        {[{
          title: 'Recent users',
          link: '/dashboard?tab=users',
          headers: ['User Image', 'Username'],
          rows: users.map(user => [<img src={user.profilePicture} alt="user" className="w-10 h-10 rounded-full bg-gray-500" />, user.username]),
          mobile: users.map(user => (
            <div key={user._id} className="flex items-center gap-4 p-3 border rounded-md">
              <img src={user.profilePicture} alt="user" className="w-10 h-10 rounded-full bg-gray-500" />
              <div>{user.username}</div>
            </div>
          )),
        }, {
          title: 'Recent comments',
          link: '/dashboard?tab=comments',
          headers: ['Comment Content', 'Likes'],
          rows: comments.map(comment => [<p className="line-clamp-2">{comment.content}</p>, comment.numberOfLikes]),
          mobile: comments.map(comment => (
            <div key={comment._id} className="border rounded-md p-3">
              <p className="text-sm font-medium mb-1 line-clamp-2">{comment.content}</p>
              <p className="text-xs text-gray-500">Likes: {comment.numberOfLikes}</p>
            </div>
          )),
        }, {
          title: 'Recent posts',
          link: '/dashboard?tab=posts',
          headers: ['Post Image', 'Post Title', 'Category'],
          rows: posts.map(post => [
            <img src={post.image} alt="post" className="w-14 h-10 rounded-md bg-gray-500" />,
            post.title,
            post.category
          ]),
          mobile: posts.map(post => (
            <div key={post._id} className="border rounded-md p-3 flex gap-4 items-start">
              <img src={post.image} alt="post" className="w-16 h-12 rounded bg-gray-500" />
              <div>
                <h2 className="font-semibold">{post.title}</h2>
                <p className="text-xs text-gray-500">Category: {post.category}</p>
              </div>
            </div>
          )),
        }].map(({ title, link, headers, rows, mobile }, index) => (
          <div key={index} className="flex flex-col w-full md:w-auto shadow-md p-4 rounded-md bg-primary text-primary border border-black dark:border-gray-700">
            <div className="flex justify-between items-center pb-3 text-sm font-semibold">
              <h1 className="p-2">{title}</h1>
              <Link to={link}>
                <button className="px-3 py-1 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-600 hover:text-white transition">
                  See all
                </button>
              </Link>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-hidden">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    {headers.map((h, i) => (
                      <th key={i} className="px-4 py-2 text-left bg-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((cols, i) => (
                    <tr key={i}>
                      {cols.map((col, j) => (
                        <td key={j} className={`px-4 py-2 ${j === 1 ? 'w-96' : ''}`}>{col}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-4">
              {mobile}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
