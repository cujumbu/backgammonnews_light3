import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BookmarkStore {
  bookmarks: string[];
  toggleBookmark: (articleId: string) => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set) => ({
      bookmarks: [],
      toggleBookmark: (articleId) =>
        set((state) => ({
          bookmarks: state.bookmarks.includes(articleId)
            ? state.bookmarks.filter((id) => id !== articleId)
            : [...state.bookmarks, articleId],
        })),
    }),
    {
      name: 'bookmarks-storage',
    }
  )
);
