import { Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
        <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput type='text' placeholder="Title"required id='title' className="flex-1"/>
                <Select>
                    <option value="Un-categorized">Select a category</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Reactjs">React.js</option>
                    <option value="nextjs">Next.js</option>
                </Select>
            </div>
            <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                <FileInput accept='image/*'/>
                <button type="button" className="bg-blue-600 text-white dark:bg-blue-500 dark:hover:bg-blue-600 px-4 py-2 rounded-md">Upload Image</button>
            </div>
            <ReactQuill theme="snow" placeholder="Write Something..." className="h-72 mb-12" />
            <Button type="submit" className="text-white bg-pink-500 hover:bg-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Publish</Button> 
                   </form>
    </div>
  )
}
