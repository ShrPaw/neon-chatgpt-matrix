# NEON//CHAT — Matrix Bloom

A visual experiment inspired by green binary rain, phosphor glow, chromatic violet edges, and pixel noise. The static preview works without an account, API key, build step, or external dependencies. It does not connect to ChatGPT; demo messages stay in the browser tab.

## Preview

Open `index.html` through a local static server (`python3 -m http.server 8765`) or publish the folder on any static host. `styles.css` and `app.js` are the only dependencies.

## Apply the look to ChatGPT in Chrome

1. Download this folder to your own computer.
2. Open `chrome://extensions`, enable **Developer mode**, choose **Load unpacked**, and select the `extension` folder.
3. Reload `https://chatgpt.com/`. Disable the extension to return to the normal look.

The extension only matches `chatgpt.com` and `chat.openai.com`. It requests no special permissions, makes no network requests, and does not read messages. Its rain canvas is visual only. ChatGPT may change its DOM over time, so some selectors might need updating.

## Limits

Publishing the preview to the cloud does not change the hosted ChatGPT product. A functioning independent chat application would need its own authentication, API integration, hosting, and usage budget.
