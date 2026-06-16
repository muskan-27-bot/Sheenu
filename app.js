// Configuration
const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY"; 

// DOM Elements
const knowledgeBaseInput = document.getElementById('knowledge-base');
const chatWindow = document.getElementById('chat-window');
const micBtn = document.getElementById('mic-btn');
const langSelect = document.getElementById('lang-select');
const statusSpan = document.getElementById('status');

// Web Speech Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.interimResults = false;
} else {
    alert("Web Speech API is not supported in this browser. Try Google Chrome.");
}

// 1. Helper: Output Text to UI
function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('msg', sender === 'User' ? 'user' : 'bot');
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// 2. Core Feature: Fetch AI Response with Custom Knowledge Base
async function getAIResponse(userText, dataContext, currentLang) {
    statusSpan.innerText = "Analyzing data & thinking...";
    
    // Dynamically tweak the system prompt based on selected language
    const languageInstruction = currentLang.startsWith('hi') 
        ? "You must respond strictly in Hindi script. Keep your tone helpful, completely natural, and deeply conversational like a friendly human expert."
        : "You must respond strictly in English. Keep your tone completely natural, friendly, and deeply conversational like a human companion.";

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Fast, accurate, and cost-efficient
                messages: [
                    {
                        role: "system",
                        content: `You are a human-like voice assistant. You are analyzing this specific dataset to answer questions: "${dataContext}". Rules:\n1. Base your answer solely on the provided data.\n2. If the answer isn't in the data, gracefully say you don't have that information.\n3. ${languageInstruction}\n4. Keep sentences brief and conversational so they sound good when spoken aloud.`
                    },
                    { role: "user", content: userText }
                ],
                temperature: 0.7
            })
        });

        const result = await response.json();
        return result.choices[0].message.content;
    } catch (error) {
        console.error("API Error:", error);
        return currentLang.startsWith('hi') ? "माफ़ कीजिये, सर्वर त्रुटि हुई।" : "Sorry, I encountered an error connecting to my brain.";
    }
}

// 3. Core Feature: Text-to-Speech (Speaking Like a Human)
function speakText(text, lang) {
    // Stop speaking any remaining audio strings first
    window.speechSynthesis.cancel(); 

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    // Optional: Fetch available browser voices and pick a highly natural voice
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find(v => v.lang === lang);
    
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    utterance.rate = 1.0;  // Speed of speech (0.1 to 10)
    utterance.pitch = 1.0; // Voice pitch (0 to 2)

    utterance.onend = () => { statusSpan.innerText = "Ready"; };
    window.speechSynthesis.speak(utterance);
}

// 4. Event Listener: Trigger Voice Capture
micBtn.addEventListener('click', () => {
    if (!recognition) return;
    
    const selectedLang = langSelect.value;
    recognition.lang = selectedLang;
    recognition.start();
    
    micBtn.disabled = true;
    statusSpan.innerText = "Listening... Speak now.";
});

// 5. Speech Recognition Handler
if (recognition) {
    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        appendMessage('User', transcript);

        const customData = knowledgeBaseInput.value || "No background data provided.";
        const selectedLang = langSelect.value;

        // Process with AI
        const aiReply = await getAIResponse(transcript, customData, selectedLang);
        
        appendMessage('Bot', aiReply);
        speakText(aiReply, selectedLang);
    };

    recognition.onerror = (e) => {
        console.error(e);
        statusSpan.innerText = "Error capturing voice.";
        micBtn.disabled = false;
    };

    recognition.onend = () => {
        micBtn.disabled = false;
        if(statusSpan.innerText === "Listening... Speak now.") {
            statusSpan.innerText = "Ready";
        }
    };
}

// Chrome workaround to ensure voices load asynchronously
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = window.speechSynthesis.getVoices;
}
