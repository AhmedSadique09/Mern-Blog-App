import { Alert, Button, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';

export default function CreatePost() {
  const [formData, setFormData] = useState<{
    title?: string;
    category?: string;
    image?: string;
    content?: string;
  }>({});
  const [publishError, setPublishError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
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
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
          </Select>
        </div>

        {/* Uploadcare uploader */}
        <div className='border-4 border-dotted border-teal-500 p-3'>
          <FileUploaderRegular
            pubkey='475b04ee15f27e13bd4b'
            sourceList="local, camera, facebook, gdrive"
            classNameUploader="uc-gray"
            onChange={(fileInfo: any) => {
              const cdnUrl = fileInfo?.cdnUrl;
              if (cdnUrl) {
                setFormData({ ...formData, image: cdnUrl });
              }
            }}
          />
        </div>

        {formData.image && (
          <img
            src={formData.image}
            alt='Uploaded'
            className='w-full h-72 object-cover'
          />
        )}

        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          onChange={(value) => setFormData({ ...formData, content: value })}
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
