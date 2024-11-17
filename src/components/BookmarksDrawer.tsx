import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useBookmarkStore } from '../store/bookmarkStore';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedArticles: Array<{
    id: string;
    title: string;
    link: string;
    date: string;
  }>;
}

export default function BookmarksDrawer({ isOpen, onClose, bookmarkedArticles }: BookmarksDrawerProps) {
  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                          onClick={onClose}
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                    <div className="relative flex-1 px-4 sm:px-6 py-6">
                      {bookmarkedArticles.length > 0 ? (
                        <div className="space-y-4">
                          {bookmarkedArticles.map((article) => (
                            <a
                              key={article.id}
                              href={article.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                {article.title}
                              </h3>
                              <time className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(article.date).toLocaleDateString()}
                              </time>
                            </a>
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
