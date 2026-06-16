# Sheenu - Conversational Chatbot Assistant

A beautiful, interactive conversational chatbot built with HTML, CSS, and JavaScript. Talk to Sheenu about anything!

## Features

✨ **Conversational AI** - Responsive conversations with pattern matching
🎨 **Beautiful UI** - Modern gradient design with smooth animations
📱 **Mobile Responsive** - Works perfectly on desktop and mobile devices
⚡ **Fast & Lightweight** - No dependencies, pure vanilla JavaScript
🔒 **Secure** - XSS protection built-in

## How to Use

1. Open `index.html` in your browser
2. Type a message in the input field
3. Press Enter or click Send
4. Chat with Sheenu!

## Try These Commands

- **Greetings**: "Hello", "Hi", "Hey"
- **Info**: "What's your name?", "What time is it?", "What's today's date?"
- **Help**: "What can you do?", "Help"
- **Goodbye**: "Bye", "Goodbye"

## File Structure

```
Sheenu/
├── index.html      # Chatbot interface
├── styles.css      # Styling and animations
├── script.js       # Chatbot logic and responses
└── README.md       # This file
```

## Customization

### Add More Responses

Edit `script.js` and add new categories to the `responses` object:

```javascript
yourCategory: {
    patterns: ['keyword1', 'keyword2'],
    responses: [
        "Your response here",
        "Another response"
    ]
}
```

## Deployment

### GitHub Pages
1. Push to GitHub
2. Go to Settings → Pages
3. Select main branch
4. Your site will be live at: `https://yourusername.github.io/Sheenu`

### Netlify or Vercel
1. Connect your GitHub repository
2. Auto-deploys on every push

## Future Enhancements

- 🤖 Integrate with OpenAI API
- 💾 Save conversation history
- 🌙 Dark mode toggle
- 🎯 Typing indicators
- 📊 Sentiment analysis

## License

Open source - feel free to use and modify!

---

**Made with ❤️ by Muskan**