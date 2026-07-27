# Video Windows Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finder video files open in multi-instance, content-sized windows with play/scrub/mute/volume controls and a description that hides on maximize.

**Architecture:** Mirror Image windows with `videofile-*` keys, `Video.jsx` + `fitVideoWindow`, Finder dispatch, and `.videofile` CSS.

**Tech Stack:** React, Zustand, existing WindowWrapper, HTML5 `<video>`

## Global Constraints

- Match Image multi-window pattern; no new npm deps
- Description hidden when maximized; controls always visible
- No autoplay

---

### Task 1: Store + Finder wiring

- [ ] Add `getVideoWindowKey` in `src/store/window.js`; count `videofile-` for offsets
- [ ] Finder: `fileType === 'video'` → `openWindow(getVideoWindowKey(item), item)`
- [ ] WindowWrapper: add `videofile` class when key starts with `videofile`; ignore `.video-controls`

### Task 2: Video window component

- [ ] Create `src/windows/Video.jsx` with fit-to-video, controls, description, multi-instance export
- [ ] Export from `windows/index.js`; mount in `App.jsx`

### Task 3: Styles + sample content

- [ ] Add `.videofile` CSS (light + dark)
- [ ] Add `/images/video.png` icon and sample entry in JA Canada folder
- [ ] Ensure `public/videos/sample.mp4` exists (local sample)

### Task 4: Verify

- [ ] Open Finder → video file → window fits, controls work, maximize hides description
