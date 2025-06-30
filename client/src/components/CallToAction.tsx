import { Button } from 'flowbite-react';

export default function CallToAction() {
  return (
    <div className='flex border border-teal-500 p-3 justify-center items-center rounded-tl-3xl rounded-br-3xl flex-col sm:flex-row text-center'>
      <div className='flex-1 justify-center flex flex-col'>
        <h2 className='text-2xl'>
          Want to learn HTML, CSS and JavaScript(React & Next) by building fun and engaging
          projects?
        </h2>
        <p className='text-gray-500 my-2'>
          Check our 5+ React.js projects website and start building your own projects
        </p>
        <a
          href='/'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Button
            className='text-white font-bold py-2 px-4 rounded bg-gradient-to-r from-purple-500 to-pink-500 rounded-tl-xl rounded-bl-none rounded-br-xl w-full'
          >
            5+ Projects Website
          </Button>
        </a>
      </div>
      <div className='flex-1 p-7'>
        <img src='/react.jpg' />
      </div>
    </div>
  );
}