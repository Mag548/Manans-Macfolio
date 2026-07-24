import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { INITIAL_Z_INDEX, WINDOW_CONFIG } from '#constants/index.js';

const createWindowState = (overrides = {}) => ({
  isOpen: false,
  isMinimized: false,
  isMaximized: false,
  zIndex: INITIAL_Z_INDEX,
  data: null,
  offsetX: 0,
  offsetY: 0,
  ...overrides,
});

export const getImgWindowKey = (item) => {
  const source = item?.imageUrl || item?.img || item?.id || 'image';
  const slug = String(source)
    .replace(/^\/images\//, '')
    .replace(/\W+/g, '-');
  return `imgfile-${slug}`;
};

const useWindowStore = create(
  immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,

    openWindow: (windowKey, data = null) =>
      set((state) => {
        if (!state.windows[windowKey]) {
          const openImages = Object.keys(state.windows).filter((key) =>
            key.startsWith('imgfile-')
          ).length;
          state.windows[windowKey] = createWindowState({
            offsetX: openImages * 28,
            offsetY: openImages * 28,
          });
        }

        const win = state.windows[windowKey];
        if (!win) return;
        win.isOpen = true;
        win.isMinimized = false;
        win.zIndex = state.nextZIndex;
        win.data = data ?? win.data;
        state.nextZIndex += 1;
      }),

    closeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.isOpen = false;
        win.isMinimized = false;
        win.isMaximized = false;
        win.zIndex = INITIAL_Z_INDEX;
        win.data = null;
      }),

    minimizeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.isMinimized = true;
        win.isMaximized = false;
      }),

    maximizeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.isMaximized = !win.isMaximized;
        win.isMinimized = false;
        win.zIndex = state.nextZIndex;
        state.nextZIndex += 1;
      }),

    focusWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.zIndex = state.nextZIndex;
        state.nextZIndex += 1;
      }),
  }))
);

export default useWindowStore;
