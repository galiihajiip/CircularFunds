'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TestPage() {
  const [count, setCount] = useState(0);
  const router = useRouter();

  const handleClick = () => {
    console.log('Button clicked!');
    setCount(count + 1);
  };

  const handleNavigate = () => {
    console.log('Navigating...');
    router.push('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Button Test Page</h1>
      
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Test 1: Basic Button</h2>
          <button
            onClick={handleClick}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Click Me (Count: {count})
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Test 2: Navigation Button</h2>
          <button
            onClick={handleNavigate}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Navigate to Home
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Test 3: Link Component</h2>
          <Link
            href="/"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Link to Home
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Test 4: Form Submit</h2>
          <form onSubmit={(e) => { e.preventDefault(); alert('Form submitted!'); }}>
            <input
              type="text"
              placeholder="Type something..."
              className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded mr-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
            >
              Submit Form
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-gray-600 dark:text-gray-400">
          Open browser console (F12) to see click logs
        </p>
      </div>
    </div>
  );
}
