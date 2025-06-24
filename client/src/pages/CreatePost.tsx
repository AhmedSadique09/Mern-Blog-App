import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreatePost() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    title?: string;
    category?: string;
    image?: string;
    content?: string;
  }>({});
  const [publishError, setPublishError] = useState<string | null>(null);
  const navigate = useNavigate();

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
      setFormData({ ...formData, image: imageUrl });
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
  try {
    const res = await axios.post('/api/post/create', formData);

    // Axios automatically parses JSON, no need for res.json()
    const data = res.data;

    navigate(`/post/${data.slug}`);
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      setPublishError(error.response.data.message);
    } else {
      setPublishError('Something went wrong');
    }
  }
};

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a Post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className='flex-1'
          />
          <Select
            required
            className='w-[150px] rounded-md text-sm text-gray-900 dark:text-white'
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
          </Select>
        </div>

        {/* Custom Uploadcare image uploader */}
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
/>


        <Button
          type='submit'
          className='text-white bg-pink-500 hover:bg-pink-800 font-medium rounded-lg text-sm px-5 py-2.5'
        >
          Publish
        </Button>

        {publishError && <Alert color='failure'>{publishError}</Alert>}
      </form>
    </div>
  );
}
