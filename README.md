# MotionPad

A gesture and voice-controlled digital whiteboard. Create and manipulate objects using hand gestures (pinch to grab, point to select, two-hand pinch to pan) and voice commands. Features an infinite canvas with pan/zoom capabilities.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

### MotionPad Whiteboard
- **Infinite Canvas**: Full-screen whiteboard with pan/zoom capabilities
- **Voice Commands**: Control the whiteboard using natural language commands
  - Create objects: "Create box", "Create sticky note", "Create circle", etc.
  - Manipulate objects: "Delete object", "Duplicate object", "Change color to [color]"
  - Canvas controls: "Zoom in", "Zoom out", "Reset canvas"
- **Hand Gesture Controls**: Use MediaPipe Hands for intuitive interactions
  - Closed fist: Grab and move objects
  - Open hand: Release objects
  - Two open hands: Pan the canvas
- **Visual Feedback**: See your hand position, selected objects, and proximity highlights
- **Object Types**: Boxes, sticky notes, circles, arrows, and text boxes

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- ShadCN UI
- Web Speech API (voice commands)
- MediaPipe Hands (gesture tracking)


