import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function UpdatePost() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    _id?: string;
    title?: string;
    category?: string;
    image?: string;
    content?: string;
  }>({});
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { postId } = useParams();

  const { currentUser } = useSelector((state: any) => state.user);

  // 👇 Fetch existing post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/post/getposts?postId=${postId}`);
        const data = res.data;

        if (res.status !== 200) {
          setPublishError(data.message || 'Failed to fetch post');
          return;
        }

        setFormData(data.posts[0]);
      } catch (err) {
        console.error(err);
        setPublishError('Failed to load post data');
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError('Please select an image');
      return;
    }

    setImageUploadError(null);
    const form = new FormData();
    form.append('file', file);
    form.append('UPLOADCARE_STORE', '1');
    form.append('UPLOADCARE_PUB_KEY', '475b04ee15f27e13bd4b');

    try {
      setImageUploadProgress(1);
      const res = await fetch('https://upload.uploadcare.com/base/', {
        method: 'POST',
        body: form,
      });

      const data = await res.json();
      if (data && data.file) {
        const imageUrl = `https://ucarecdn.com/${data.file}/`;
        setFormData((prev) => ({ ...prev, image: imageUrl }));
        setImageUploadProgress(null);
      } else {
        setImageUploadError('Upload failed');
        setImageUploadProgress(null);
      }
    } catch (error) {
      console.error(error);
      setImageUploadError('Upload failed');
      setImageUploadProgress(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.image || !formData.content) {
      setPublishError('Please provide all required fields');
      return;
    }

    try {
      const res = await axios.put(
        `/api/post/updatepost/${postId}/${currentUser._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      const data = res.data;

      setPublishError(null);
      setPublishSuccess('Post updated successfully ✅');

       setTimeout(() => {
      navigate('/dashboard?tab=posts');
    }, 2000);
    } catch (error: any) {
      if (error.response?.data?.message) {
        setPublishError(error.response.data.message);
      } else {
        setPublishError('Something went wrong');
      }
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Update Post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className='flex-1'
          />
          <Select
            required
            className='w-[150px] rounded-md text-sm text-gray-900 dark:text-white'
            value={formData.category || ''}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value=''>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
          </Select>
        </div>

        <div className='flex gap-4 items-center justify-between p-3'>
          <FileInput
            accept='image/*'
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Button
            type='button'
            onClick={handleUploadImage}
            disabled={!!imageUploadProgress}
            className='bg-blue-600 text-white px-2 py-6 rounded-md hover:bg-blue-700'
          >
            {imageUploadProgress ? 'Uploading...' : 'Upload Image'}
          </Button>
        </div>

        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}

        {formData.image && (
          <img
            src={formData.image}
            alt='Uploaded'
            className='w-full h-72 object-cover'
          />
        )}

        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12 transition-colors"
          value={formData.content || ''}
          onChange={(value) => setFormData({ ...formData, content: value })}
        />

        <Button
          type='submit'
          className='text-white bg-pink-500 hover:bg-pink-800 font-medium rounded-lg text-sm px-5 py-2.5'
        >
          Update
        </Button>

        {publishError && <Alert color='failure'>{publishError}</Alert>}
        {publishSuccess && <Alert color='success'>{publishSuccess}</Alert>}
      </form>
    </div>
  );
}
