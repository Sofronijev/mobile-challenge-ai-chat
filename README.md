# Studyflash Hiring Challenge: Starting Point

## Intro

Welcome! Use this repo as the starting point for your submission to the **Studyflash** mobile developer hiring challenge. You’ll build a simple streaming AI chatbot that mimics the look and feel of **ChatGPT**

---

## Getting started

- **pnpm** installed
- Gemini API key (provided as part of the challenge)

Create `.env.local` in the project root:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=provided_key_here
```

---

## Running in Expo

1. Install deps:

   ```bash
   pnpm install
   ```

2. Start the dev server:

   ```bash
   npx expo
   ```

3. Open the app:
   - **iOS Simulator:** press `i` in the terminal.
   - **Real device:** install **Expo Go**, scan the QR code.

---

## Key files to work on

- **Primary (chat UI):** `app/(tabs)/index.tsx`
  _This is the main file to implement your chat experience._
- **API route (streaming/tools example):** `app/api/chat+api.ts`

---

## Development build (optional)

If you need more than Expo Go (e.g., native modules or a custom dev client):

- Use the prepared branch:

  ```bash
  git checkout native-development-build
  ```

- Or create your own dev client:

  ```bash
  pnpm expo run:ios
  pnpm expo start
  ```

## My notes

This is a React Native (Expo) chat application I built as part of a coding assignment.
The project aims to replicate a chat experience as close as possible to ChatGPT.

Below is a summary of the main features I implemented:

- Designed the UI to resemble ChatGPT, including header, input area, messages, and icons (some are approximations).

- Implemented multiline input with buttons for text-to-speech, voice mode, and file attachment (UI only), with icons changing when the user starts typing.

- In the header, added a title with a sidebar button, and an icon for temporary chat when there are no messages; if messages exist, show new message and menu icons (UI only).

- Formatted messages so that newly submitted messages appear at the top of the screen. For AI responses, added action icons underneath for playing the message, thumbs up, thumbs down, sharing (not working), copying, and refreshing (working).

- Added the ability to stop an ongoing AI request after sending a question.

- Added an animated indicator to show when the AI is preparing a response.

- Implemented a weather widget displaying city name and temperature in Fahrenheit, which can be toggled to Celsius by tapping the arrow icon. The weather condition is displayed based on the temperature.

- Added a Null screen that appears when there are no messages in the chat, showing some suggested messages.