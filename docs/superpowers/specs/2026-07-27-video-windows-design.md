# Video Windows Design

## Goal

Allow Finder video files to open in their own windows, sized to the video’s aspect ratio, with standard playback controls (play/pause, scrubber, mute, volume) and an optional description that hides when the window is maximized.

## Decisions

- Open from Finder only (`fileType: "video"`), same pattern as images
- Multiple windows at once (`videofile-*` dynamic keys)
- Custom controls (not native `<video controls>`)
- No autoplay; close pauses and resets
- Description under the player; hidden when `isMaximized`

## Data model

```js
{
  name: "demo.mp4",
  icon: "/images/video.png",
  kind: "file",
  fileType: "video",
  videoUrl: "/videos/demo.mp4",
  description: "Caption shown until maximized.",
}
```

## Architecture

1. `getVideoWindowKey(item)` → `videofile-{slug}` from `videoUrl` / `id`
2. `Video.jsx` + multi-instance `VideoWindows` (mirror `Image.jsx`)
3. `fitVideoWindow` on `loadedmetadata` / open — account for header, description, control bar
4. Finder `openItem` branch for `fileType === 'video'`
5. CSS `.videofile` (fit layout + controls + description)
6. WindowWrapper adds `videofile` class for keys starting with `videofile`

## UI

| Region | Behavior |
|--------|----------|
| Header | Traffic lights + filename |
| Video | Aspect-fit; fills content when maximized |
| Description | Shown when `description` set and not maximized |
| Controls | Play/pause, scrubber, mute, volume slider (always visible) |

## Out of scope

- Photos app / dock video app
- Autoplay / playlist / fullscreen API
