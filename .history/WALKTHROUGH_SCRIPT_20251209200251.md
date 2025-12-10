# Sound Paint - Code Walkthrough Script

## Part 1: Introduction

Hi everyone! Today I'm going to talk about the core code of my **Sound Paint** project. This is a collaborative web application where multiple users can paint together on a shared canvas, and the cool part is — your voice and sounds control the brush! So basically, the idea is that when you make sounds into your microphone, it changes the color and size of your brush strokes in real-time.

I'm going to focus on three main files that really showcase what I learned in web development and creative coding — they're the heart of the application:

1. **`server.js`** - The backend server that handles real-time communication
2. **`public/sketch.js`** - The p5.js sketch that does all the audio analysis and drawing
3. **`public/index.html`** - The user interface with all the controls

Let me show you how everything works together.

---

## Part 2: Detailed Code Walkthrough

---

### File 1: `server.js`

This is the backend server that manages all the real-time collaboration.

#### Lines 1-8: Setting Up the Server

Here I'm importing all the necessary libraries. I chose Express because it's the most popular web framework for Node.js — super easy to set up. And then Socket.io is the magic that makes real-time communication possible. You know, normally HTTP is like sending letters back and forth, but Socket.io is like having an open phone line — instant communication!

I'm creating an HTTP server and wrapping it with Socket.io. This pattern is pretty standard for real-time apps.

#### Lines 10-12: Configuration

Here I'm setting the port to 3005 by default, but it can be overridden by environment variables — which is useful for deployment. The `express.static` line tells Express to serve all the files in the `public` folder.

#### Lines 14-28: Handling User Connections and Room Joining

This is where the room system works! When a user connects, Socket.io automatically gives them a unique socket.id. Then when they emit a `join` event with their room code and username, I use `socket.join(room)` to put them in that specific room.

I think of rooms like different "channels" on Discord. People in the same room can see each other's drawings, but they can't see what's happening in other rooms.

The cool thing here is on lines 24-27 — I'm sending back information to let everyone know someone joined. `socket.to(room)` sends to everyone EXCEPT the sender, while `io.to(room)` sends to EVERYONE including the sender. This distinction is really important!

#### Lines 30-42: Broadcasting Drawing Strokes

This is the heart of the collaboration! When a user draws something, they emit a `sound:stroke` event with all the brush data — position, color, size, everything. The server then broadcasts this to everyone else in the same room.

I had to filter out socket.id from the rooms because Socket.io automatically puts each socket in a "room" with its own ID. So I'm only broadcasting to actual collaborative rooms, not back to the sender.

#### Lines 44-58: Canvas Clear and Disconnect Handling

The `canvas:clear` event is straightforward — when someone clears the canvas, everyone else's canvas gets cleared too.

The disconnect handler is important for updating the online user count. When someone leaves, I broadcast the new count to everyone remaining in the room.

---

### File 2: `public/sketch.js`

This is where all the magic happens! This file handles audio analysis, drawing, and communication with the server.

#### Lines 1-21: Global Variables

I'm declaring all my global variables here. The key audio-related ones are mic, amp, and fft. The `GATE_THRESHOLD` at 0.02 is like a noise gate — if the sound is too quiet (below 2%), we ignore it. This prevents random background noise from triggering the brush.

I chose `[15, 15, 20]` for the background color because it's a very dark blue-gray — it makes the colorful brush strokes really pop!

#### Lines 23-41: Setup Function

In the setup function, I'm creating a full-screen WEBGL canvas. I chose WEBGL mode because it gives better performance for the kind of additive blending effects I'm using.

On lines 29-32, I'm checking if the p5.brush library is loaded. This is a really cool external library that provides realistic brush textures like watercolor and charcoal.

Then I initialize all the different systems — room management, socket connection, microphone, and UI controls.

#### Lines 43-84: The Draw Loop

The draw function runs 60 times per second.

Lines 44-52 handle the trail effect. If trail strength is greater than 0, I draw a semi-transparent rectangle over the entire canvas. This creates a fading effect where old strokes gradually disappear.

Line 54 calls `analyzeSound()` EVERY frame, even if the mouse isn't pressed. This is important because I want the audio preview panel to always update.

Lines 62-72 handle the jitter brush mode — I interpolate between the previous and current mouse positions. This creates smoother strokes when you move the mouse fast.

Lines 75-79 are the throttling — I only emit strokes every 2nd frame. Sending data every single frame would flood the network.

#### Lines 86-128: The Audio Analysis Function

This is probably the most interesting function in the whole project!

Lines 96-98: I'm getting the amplitude from the microphone and applying smoothing with lerp — it blends 30% of the new value with 70% of the old value.

Lines 100-102: The FFT gives us a spectrum array where each index represents a different frequency. Index 16 is mid-frequency range, and index 48 is high frequencies.

Lines 104-106: Here's the mapping magic!
- Hue: Amplitude maps from 220 (blue) to 20 (red/orange). So quiet sounds are cool blue, loud sounds are warm red!
- Saturation: Mid frequencies control how vibrant the color is
- Lightness: High frequencies control brightness

Lines 121-124: The brush size also responds to sound! It scales from 50% to 250% of the base size depending on amplitude.

#### Lines 130-165: Audio Preview UI Update

This function updates the visual preview panel in real-time. The volume bar changes color — green when above the gate threshold, gray when below.

#### Lines 193-214: The Jittery Brush Effect

This is my custom brush that I'm really proud of! It creates a glowing, organic-looking effect by using ADD blend mode, drawing multiple jittered circles at random offsets, and each circle has three layers — a big faint outer glow, a medium middle layer, and a small bright core.

#### Lines 308-340: Socket Event Handlers

This sets up all the socket event listeners. When we receive a `sound:stroke` event from another user, we call `drawBrush()` to render their stroke on our canvas. The same drawing functions work for both local and remote strokes!

#### Lines 352-477: UI Initialization

The microphone initialization was tricky! You MUST call `getAudioContext().resume()` before starting the mic — this is a browser security requirement.

I add a 500ms delay after `mic.start()` before creating the analyzers. Creating them too early causes weird "RingBuffer" errors.

The 0.7 parameter for Amplitude and FFT is the smoothing factor. Higher values mean smoother but slower-responding readings.

---

### File 3: `public/index.html`

#### Lines 8-12: Library Imports

I'm using Tailwind CSS for styling, p5.js for creative coding, p5.sound for audio, p5.brush for realistic brush textures, and Socket.io for real-time communication.

I chose CDN links instead of npm packages because it keeps the project simple and doesn't require a build step.

#### Lines 19-93: The Control Bar

The top bar uses Tailwind's flexbox utilities. I added `backdrop-blur-sm` to give it a frosted glass effect — it looks modern and doesn't completely block the canvas behind it.

#### Lines 59-88: Audio Preview Panel

This is the audio preview panel I added to help users understand the sound-to-visual mapping. The `transition-all duration-75` makes the bars animate smoothly.

---

## Part 3: Troubleshooting & Reflection

### Challenge 1: Audio Initialization Timing

**Problem**: The audio analyzers would throw "RingBuffer allocation failed" errors randomly.

**Solution**: Adding a 500ms delay after `mic.start()` before creating the analyzers fixed it completely.

**What I learned**: Browser audio APIs are asynchronous and need time to set up.

### Challenge 2: WEBGL Coordinate System

**Problem**: In WEBGL mode, the origin (0,0) is at the CENTER of the canvas, not the top-left. My mouse coordinates were all wrong.

**Solution**: Always store and transmit coordinates in screen space, then convert to WEBGL space only when drawing.

**What I learned**: When mixing different coordinate systems, pick one as the "source of truth" and convert at the boundaries.

### Challenge 3: Network Throttling

**Problem**: Sending brush data every frame (60fps) was way too much data.

**Solution**: Sending every 2nd frame hits the sweet spot — about 30 updates per second.

**What I learned**: Real-time doesn't mean "as fast as possible" — it means "fast enough to feel instant."

### Challenge 4: Sound Responsiveness

**Problem**: Users couldn't see the effect of their voice. The color changes were too subtle.

**Solution**: Added the visual audio preview panel so users can SEE what the microphone is picking up. Also made sound affect brush SIZE, not just color.

**What I learned**: Feedback is crucial! Users need to see that the system is responding to them.

### Future Improvements

1. Canvas state sync for new users joining a room
2. Better mobile support
3. Recording and playback feature

---

## Part 4: Conclusion

So that's Sound Paint! To recap, we covered:

1. **server.js** — A Socket.io server managing real-time room-based collaboration
2. **sketch.js** — The p5.js sketch with audio analysis, sound-to-visual mapping, and multiple brush modes
3. **index.html** — The UI with Tailwind CSS and real-time audio preview

The key concepts I demonstrated:
- Real-time WebSocket communication with Socket.io rooms
- Audio analysis using p5.Amplitude and p5.FFT
- Creative coding patterns like blend modes, interpolation, and generative brushes
- State synchronization between multiple clients

What I'm most proud of is how the audio preview panel came together — it really helps users understand and control the sound-to-visual connection. And the jittery glow brush effect is something I developed myself, and I think it looks really beautiful!

Thanks for watching!

---

*Script prepared for Core Lab Fall 2025*
