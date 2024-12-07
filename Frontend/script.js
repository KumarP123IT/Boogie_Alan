const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

const API_URL = 'http://localhost:5000'; 


sendButton.addEventListener('click', handleUserMessage);


function handleUserMessage() {
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;


  displayMessage(userMessage, 'user');

  
  fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: userMessage }),
  })
    .then(response => response.json())
    .then(data => {
      const botResponse = data.response || "I'm sorry, I couldn't understand that.";
      displayMessage(botResponse, 'bot');
    })
    .catch(err => {
      console.error(err);
      displayMessage("Error connecting to the server.", 'bot');
    });

  
  chatInput.value = '';
}


function displayMessage(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
  messageElement.textContent = message;

 
  chatMessages.appendChild(messageElement);

  
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
