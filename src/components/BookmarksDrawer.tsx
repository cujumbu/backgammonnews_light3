import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useBookmarkStore } from '../store/bookmarkStore';

export default function BookmarksDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { bookmarks } = useBookmarkStore();
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);

  useEffect(() => {
    const button = document.getElementById('bookmarks-button');
    if (button) {
      button.addEventListener('click', () => setIsOpen(true));
    }
  }, []);

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={React.Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-900 shadow-xl">
                    <div className="px-4 sm:px-6 py-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                          Bookmarked Articles
                        </Dialog.Title>
                        <button
                          type="button"
                          className="rounded-md text-gray-400 hover:text-gray-500"
                          onClick={() => setIsOpen(false)}
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                    <div className="relative flex-1 px-4 sm:px-6 py-6">
                      {bookmarks && bookmarks.length > 0 ? (
                        <div className="space-y-4">
                          {bookmarks.map((articleId) => (
                            <div key={articleId} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                              <p className="text-gray-900 dark:text-white">Article ID: {articleId}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">
                          No bookmarked articles yet
                        </p>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
