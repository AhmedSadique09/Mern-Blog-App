import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import axios from 'axios';

type Post = {
  _id: string;
  slug: string;
  image: string;
  title: string;
  category: string;
  [key: string]: any;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

   useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/api/post/getPosts');
        setPosts(res.data.posts);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, []);
  return (
    <div>
      <div className='flex flex-col gap-6 p-10  px-3 max-w-6xl mx-auto '>
        <h1 className='text-3xl font-bold lg:text-6xl pt-10'>Welcome to my Blog</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>
          Welcome to my blog! Here you'll find a wide range of articles,
          tutorials, and resources designed to help you grow as a developer.
          Whether you're interested in web development, software engineering,
          programming languages, or best practices in the tech industry, there's
          something here for everyone. Dive in and explore the content to expand
          your knowledge and skills.
        </p>
        <Link
          to='/search'
          className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
        >
          View all posts
        </Link>
        <div>
          <CallToAction />
        </div>
      </div>

      <div className='max-w-6xl mx-auto p-3 flex gap-8 py-3'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex  gap-3'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}