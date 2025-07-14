
# AI Language Translator

A sleek and modern web application that leverages the Google Gemini API to provide fast and accurate translations. Users can input text, select a target language, and receive the translation in real-time. It features a clean, responsive interface built with React and Tailwind CSS.

This project serves as a practical demonstration of integrating the powerful `gemini-2.5-flash` model into a user-friendly application without a complex build setup, using modern ES Modules and import maps.

***

## ✨ Features

- **Real-time Translation:** Get instant translations powered by Google's state-of-the-art AI.
- **Multi-language Support:** Translate between a wide array of languages.
- **Auto-Detect Language:** Automatically identify the source language of the input text for seamless translation.
- **Swap Languages:** Easily switch the source and target languages with a single click. The text in the input fields will also be swapped.
- **Copy to Clipboard:** Quickly copy the translated text with a convenient button.
- **Responsive Design:** A clean, modern, and fully responsive interface that works beautifully on desktops, tablets, and mobile devices.
- **Clear User Feedback:** Visual indicators for loading states during translation and clear error messages if something goes wrong.

## 🛠️ Tech Stack

- **Frontend Framework:** [React](https://reactjs.org/) (v19) with [TypeScript](https://www.typescriptlang.org/)
- **AI Model:** [Google Gemini API](https://ai.google.dev/) (`@google/genai`) using the `gemini-2.5-flash` model.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (via CDN for simplicity)
- **Module System:** Modern ES Modules loaded via `importmap` for a buildless development experience.

## ⚙️ How It Works

The application provides a straightforward interface for translation tasks. Here's the flow:

1.  The user enters text into the source text area.
2.  The user selects a source language (or leaves it as 'Auto-Detect') and a target language from the dropdown menus.
3.  Upon clicking the "Translate" button, the `geminiService` is invoked.
4.  This service constructs a specific prompt, instructing the Gemini model to act as an expert translator and to return **only** the translated text, ensuring a clean output.
5.  The request is sent to the Gemini API. While waiting, the UI displays a loading animation.
6.  The API's response is received, and the translated text is displayed in the output area. The "Copy" button becomes available.
7.  If any errors occur during the API call, a descriptive error message is shown to the user.

## 🔑 API Key Configuration

To function, this application requires a Google Gemini API key.

The API key **must** be provided as an environment variable named `API_KEY`. The application code is configured to read this key directly from `process.env.API_KEY`.

**Important:** The application is designed with security and simplicity in mind. It does **not** include any UI elements for entering an API key. You must configure this environment variable in the platform where you deploy or run this application.

## 🚀 Getting Started

Since this project uses an `importmap` and loads dependencies via a CDN, there is no build step required. You can run it locally with any simple static file server.

**1. Clone the repository:**
```bash
git clone <your-repository-url>
cd <repository-folder>
```

**2. Set up the Environment Variable:**
How you set the `API_KEY` will depend on your hosting environment. For local development, you can use a tool like `live-server` which can be configured to inject environment variables, or simply run it on a platform that allows you to set them.

**3. Serve the `index.html` file:**
You can use any local web server. A popular and easy option is the `http-server` package from npm.

```bash
# Install http-server globally (if you haven't already)
npm install -g http-server

# Serve the current directory
http-server .
```
Now, open your browser and navigate to the local address provided by the server (e.g., `http://127.0.0.1:8080`).

## 📂 Project Structure

```
.
├── index.html          # Main HTML file with importmap and Tailwind CSS setup
├── index.tsx           # React application entry point
├── App.tsx             # The main application component with all UI and logic
├── constants.ts        # Defines the list of supported source and target languages
├── services/
│   └── geminiService.ts  # Logic for making calls to the Gemini API
└── metadata.json       # Application metadata
```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
