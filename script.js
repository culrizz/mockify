// ===== DOM Elements =====
const tabButtons = document.querySelectorAll('.tab-btn');
const generatorSections = document.querySelectorAll('.generator-section');

// WhatsApp elements
const waContactInput = document.getElementById('wa-contact');
const waUserInput = document.getElementById('wa-user');
const waStatusInput = document.getElementById('wa-status');
const waChatInput = document.getElementById('wa-chat');
const waPreview = document.getElementById('whatsapp-preview');
const waRandomBtn = document.getElementById('wa-random');
const waGenerateBtn = document.getElementById('wa-generate');
const waDownloadBtn = document.getElementById('wa-download');
const waRefreshBtn = document.getElementById('wa-refresh');

// Instagram elements
const igContactInput = document.getElementById('ig-contact');
const igUserInput = document.getElementById('ig-user');
const igStatusInput = document.getElementById('ig-status');
const igChatInput = document.getElementById('ig-chat');
const igPreview = document.getElementById('instagram-preview');
const igRandomBtn = document.getElementById('ig-random');
const igGenerateBtn = document.getElementById('ig-generate');
const igDownloadBtn = document.getElementById('ig-download');
const igRefreshBtn = document.getElementById('ig-refresh');

// ===== Tab Switching =====
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const platform = button.dataset.platform;
        
        // Update active tab button
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Show active section
        generatorSections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${platform}-generator`).classList.add('active');
        
        // Refresh preview
        if (platform === 'whatsapp') {
            renderWhatsAppChat();
        } else {
            renderInstagramChat();
        }
    });
});

// ===== WhatsApp Functions =====
function renderWhatsAppChat() {
    const contact = waContactInput.value.trim() || 'John Smith';
    const user = waUserInput.value.trim() || 'You';
    const status = waStatusInput.value.trim() || 'Online';
    const chatText = waChatInput.value;
    
    // Parse messages
    const messages = parseChatMessages(chatText, user);
    
    // Generate HTML
    waPreview.innerHTML = `
        <div class="wa-header">
            <div class="wa-back"><i class="fas fa-arrow-left"></i></div>
            <div class="wa-contact">
                <div class="wa-name">${contact}</div>
                <div class="wa-status">
                    <i class="fas fa-circle"></i> ${status}
                </div>
            </div>
            <div class="wa-actions">
                <i class="fas fa-video"></i>
                <i class="fas fa-phone"></i>
                <i class="fas fa-ellipsis-v"></i>
            </div>
        </div>
        
        <div class="wa-messages">
            ${messages.map((msg, index) => `
                <div class="wa-message ${msg.sender === user ? 'sent' : 'received'}" 
                     style="animation-delay: ${index * 0.1}s">
                    <div class="wa-text">${msg.text}</div>
                    <div class="wa-time">${msg.time}</div>
                </div>
            `).join('')}
        </div>
        
        <div class="wa-input-area">
            <div class="wa-input" contenteditable="true">Type a message</div>
            <div class="wa-send">
                <i class="fas fa-microphone"></i>
            </div>
        </div>
    `;
}

function generateRandomWhatsApp() {
    // Random names
    const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'Robert', 'Sophia'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'];
    
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    waContactInput.value = `${randomFirstName} ${randomLastName}`;
    waUserInput.value = 'You';
    waStatusInput.value = Math.random() > 0.5 ? 'Online' : 'Last seen recently';
    
    // Generate random conversation
    const messages = [];
    const messageCount = Math.floor(Math.random() * 5) + 4;
    
    for (let i = 0; i < messageCount; i++) {
        const isUser = Math.random() > 0.5;
        const sender = isUser ? 'You' : randomFirstName;
        
        // Generate realistic message
        let message = '';
        if (i === 0) {
            message = getRandomGreeting();
        } else if (i === messageCount - 1) {
            message = getRandomClosing();
        } else {
            message = getRandomMessage();
        }
        
        messages.push(`${sender}: ${message}`);
    }
    
    waChatInput.value = messages.join('\n');
    renderWhatsAppChat();
}

function downloadWhatsAppScreenshot() {
    if (!html2canvas) {
        alert('Screenshot library not loaded. Please check your internet connection.');
        return;
    }
    
    html2canvas(waPreview, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `whatsapp-chat-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // Show success message
        showToast('WhatsApp screenshot downloaded!', 'success');
    }).catch(error => {
        console.error('Error generating screenshot:', error);
        showToast('Error generating screenshot', 'error');
    });
}

// ===== Instagram Functions =====
function renderInstagramChat() {
    const contact = igContactInput.value.trim() || 'sarah.creative';
    const user = igUserInput.value.trim() || 'yourstyle';
    const status = igStatusInput.value.trim() || 'Active 1h ago';
    const chatText = igChatInput.value;
    
    // Parse messages
    const messages = parseChatMessages(chatText, user);
    
    // Generate HTML
    igPreview.innerHTML = `
        <div class="ig-header">
            <div class="ig-back"><i class="fas fa-arrow-left"></i></div>
            <div class="ig-contact">
                <div class="ig-avatar">${contact.charAt(0).toUpperCase()}</div>
                <div>
                    <div class="ig-name">${contact}</div>
                    <div class="ig-status">${status}</div>
                </div>
            </div>
            <div class="ig-actions">
                <i class="fas fa-video"></i>
                <i class="fas fa-info-circle"></i>
            </div>
        </div>
        
        <div class="ig-messages">
            ${messages.map((msg, index) => `
                <div class="ig-message ${msg.sender === user ? 'sent' : 'received'}" 
                     style="animation-delay: ${index * 0.1}s">
                    <div class="ig-text">${msg.text}</div>
                    <div class="ig-time">${msg.time}</div>
                </div>
            `).join('')}
        </div>
        
        <div class="ig-input-area">
            <div class="ig-input" contenteditable="true">Message...</div>
            <div class="ig-send">
                <i class="fas fa-paper-plane"></i>
            </div>
        </div>
    `;
}

function generateRandomInstagram() {
    // Random usernames
    const usernames = [
        'sarah.creative', 'alex.design', 'emma.visuals', 'mike.photo',
        'lisa.art', 'david.studio', 'sophia.lens', 'john.creative'
    ];
    
    const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
    
    igContactInput.value = randomUsername;
    igUserInput.value = 'yourstyle';
    igStatusInput.value = Math.random() > 0.5 ? 'Active now' : 'Active 1h ago';
    
    // Generate random conversation
    const messages = [];
    const messageCount = Math.floor(Math.random() * 5) + 4;
    
    for (let i = 0; i < messageCount; i++) {
        const isUser = Math.random() > 0.5;
        const sender = isUser ? 'yourstyle' : randomUsername.split('.')[0];
        
        // Generate realistic message with emojis
        let message = '';
        if (i === 0) {
            message = getRandomInstagramGreeting();
        } else if (i === messageCount - 1) {
            message = getRandomInstagramClosing();
        } else {
            message = getRandomInstagramMessage();
        }
        
        messages.push(`${isUser ? 'yourstyle' : randomUsername}: ${message}`);
    }
    
    igChatInput.value = messages.join('\n');
    renderInstagramChat();
}

function downloadInstagramScreenshot() {
    if (!html2canvas) {
        alert('Screenshot library not loaded. Please check your internet connection.');
        return;
    }
    
    html2canvas(igPreview, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `instagram-dm-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // Show success message
        showToast('Instagram screenshot downloaded!', 'success');
    }).catch(error => {
        console.error('Error generating screenshot:', error);
        showToast('Error generating screenshot', 'error');
    });
}

// ===== Utility Functions =====
function parseChatMessages(chatText, currentUser) {
    const lines = chatText.split('\n').filter(line => line.trim());
    const messages = [];
    
    lines.forEach((line, index) => {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) return;
        
        const sender = line.substring(0, colonIndex).trim();
        const text = line.substring(colonIndex + 1).trim();
        
        if (sender && text) {
            // Generate realistic time (incremental)
            const baseTime = new Date();
            baseTime.setMinutes(baseTime.getMinutes() - (lines.length - index));
            const timeStr = baseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            messages.push({
                sender,
                text,
                time: timeStr
            });
        }
    });
    
    return messages;
}

function getRandomGreeting() {
    const greetings = [
        "Hey there! How are you?",
        "Hello! Hope you're doing well",
        "Hi! Got a minute to chat?",
        "Hey! What's up?",
        "Hello! How's your day going?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
}

function getRandomMessage() {
    const messages = [
        "I was thinking about that project",
        "Can you send me the details?",
        "That sounds like a great idea",
        "Let me check and get back to you",
        "What do you think about this?",
        "I just finished the report",
        "We should schedule a meeting",
        "Thanks for your help with this
