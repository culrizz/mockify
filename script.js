// ===== DOM ELEMENTS =====
const demoChat = document.getElementById('demo-chat');
const livePreview = document.getElementById('live-preview');
const messageList = document.getElementById('message-list');
const newMessageInput = document.getElementById('new-message');
const messageSenderSelect = document.getElementById('message-sender');
const addMessageBtn = document.getElementById('add-message');
const platformOptions = document.querySelectorAll('.platform-option');
const generateRandomBtn = document.querySelector('.btn-generate-random');
const downloadPngBtn = document.getElementById('download-png');
const copyHtmlBtn = document.getElementById('copy-html');
const shareLinkBtn = document.getElementById('share-link');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const toastClose = document.getElementById('toast-close');
const templateGrid = document.querySelector('.templates-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const loadMoreTemplatesBtn = document.getElementById('load-more-templates');
const pricingToggle = document.getElementById('pricing-toggle');
const pricingAmounts = document.querySelectorAll('.amount');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeDemoChat();
    initializePlatformSelection();
    initializeMessageControls();
    loadTemplates();
    initializePricingToggle();
    initializeToast();
    
    // Generate initial random chat
    generateRandomChat();
});

// ===== DEMO CHAT =====
function initializeDemoChat() {
    const demoMessages = [
        { sender: 'received', text: 'Hey! Did you see the new Mockify tool?', time: '10:30 AM' },
        { sender: 'sent', text: 'Yeah! It looks amazing for creating chat mockups!', time: '10:32 AM' },
        { sender: 'received', text: 'Perfect for my UI design projects. The customization is incredible!', time: '10:33 AM' },
        { sender: 'sent', text: 'I love how you can export directly to PNG or copy the HTML code.', time: '10:35 AM' },
        { sender: 'received', text: 'And it\'s completely free to get started! 🎉', time: '10:36 AM' }
    ];
    
    demoMessages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.sender}`;
        messageDiv.innerHTML = `
            <div class="message-text">${msg.text}</div>
            <div class="message-time">${msg.time}</div>
        `;
        demoChat.appendChild(messageDiv);
    });
}

// ===== PLATFORM SELECTION =====
function initializePlatformSelection() {
    platformOptions.forEach(option => {
        option.addEventListener('click', () => {
            platformOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            updatePreview();
        });
    });
}

// ===== MESSAGE CONTROLS =====
function initializeMessageControls() {
    addMessageBtn.addEventListener('click', addCustomMessage);
    newMessageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addCustomMessage();
    });
    
    generateRandomBtn.addEventListener('click', generateRandomChat);
}

function addCustomMessage() {
    const text = newMessageInput.value.trim();
    const senderIndex = parseInt(messageSenderSelect.value);
    
    if (!text) {
        showToast('Please enter a message first!', 'warning');
        return;
    }
    
    // Add to message list
    const messageItem = document.createElement('div');
    messageItem.className = 'message-item';
    messageItem.innerHTML = `
        <span>${senderIndex === 0 ? 'You' : 'Friend'}: ${text}</span>
        <button class="btn-remove-message">&times;</button>
    `;
    
    messageList.appendChild(messageItem);
    
    // Add remove functionality
    const removeBtn = messageItem.querySelector('.btn-remove-message');
    removeBtn.addEventListener('click', () => {
        messageItem.remove();
        updatePreview();
    });
    
    // Clear input
    newMessageInput.value = '';
    
    // Update preview
    updatePreview();
}

// ===== RANDOM CHAT GENERATION =====
function generateRandomChat() {
    // Clear existing messages
    messageList.innerHTML = '';
    
    // Random funny messages
    const randomMessages = [
        "Hey! How's it going?",
        "Did you finish that project?",
        "I just discovered this awesome tool!",
        "Check out this funny meme 😂",
        "Are we still meeting tomorrow?",
        "Can you send me those files?",
        "Just watched an amazing movie!",
        "What do you think about this design?",
        "LOL that's hilarious!",
        "I'm running a bit late, sorry!",
        "The meeting got rescheduled",
        "Thanks for your help!",
        "Let's catch up this weekend!",
        "Did you see the new update?",
        "This is going to be epic!",
        "I need your opinion on something",
        "Can't wait to show you!",
        "That sounds like a great plan!",
        "OMG you won't believe this!",
        "I'm so excited for this! 🎉"
    ];
    
    // Generate 5-8 random messages
    const messageCount = Math.floor(Math.random() * 4) + 5;
    
    for (let i = 0; i < messageCount; i++) {
        const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        const randomSender = Math.random() > 0.5 ? 0 : 1;
        
        // Add to message list
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        messageItem.innerHTML = `
            <span>${randomSender === 0 ? 'You' : 'Friend'}: ${randomMessage}</span>
            <button class="btn-remove-message">&times;</button>
        `;
        
        messageList.appendChild(messageItem);
        
        // Add remove functionality
        const removeBtn = messageItem.querySelector('.btn-remove-message');
        removeBtn.addEventListener('click', () => {
            messageItem.remove();
            updatePreview();
        });
    }
    
    updatePreview();
}

// ===== PREVIEW UPDATES =====
function updatePreview() {
    // Get all messages
    const messageItems = messageList.querySelectorAll('.message-item');
    const messages = [];
    
    messageItems.forEach(item => {
        const text = item.textContent.replace('×', '').trim();
        const [senderText, ...messageParts] = text.split(': ');
        const messageText = messageParts.join(': ');
        const isSent = senderText === 'You';
        
        messages.push({
            text: messageText,
            isSent: isSent,
            time: generateRandomTime()
        });
    });
    
    // Get selected platform
    const selectedPlatform = document.querySelector('.platform-option.active').dataset.platform;
    
    // Update preview
    livePreview.innerHTML = generatePreviewHTML(selectedPlatform, messages);
}

function generatePreviewHTML(platform, messages) {
    const platformColors = {
        whatsapp: { sent: '#25D366', received: '#FFFFFF' },
        imessage: { sent: '#007AFF', received: '#F2F2F7' },
        instagram: { sent: '#0095F6', received: '#EFEFEF' },
        twitter: { sent: '#1DA1F2', received: '#F7F9F9' },
        facebook: { sent: '#0084FF', received: '#F0F0F0' }
    };
    
    const colors = platformColors[platform] || platformColors.whatsapp;
    
    let messagesHTML = '';
    messages.forEach(msg => {
        messagesHTML += `
            <div class="preview-message ${msg.isSent ? 'sent' : 'received'}" 
                 style="${msg.isSent ? `background-color: ${colors.sent}; color: white` : `background-color: ${colors.received}; color: #333`}">
                ${msg.text}
                <div class="preview-time">${msg.time}</div>
            </div>
        `;
    });
    
    return `
        <div class="preview-wrapper" style="background-color: ${platform === 'dark' ? '#000' : '#F8F9FA'}; padding: 20px; border-radius: 10px; max-width: 400px; margin: 0 auto;">
            <div class="preview-header" style="display: flex; align-items: center; padding: 10px; background-color: ${platform === 'dark' ? '#1A1A1A' : '#FFFFFF'}; border-radius: 10px 10px 0 0;">
                <div class="preview-avatar" style="width: 40px; height: 40px; border-radius: 50%; background-color: #${Math.floor(Math.random()*16777215).toString(16)}; margin-right: 10px;"></div>
                <div>
                    <div style="font-weight: bold; color: ${platform === 'dark' ? '#FFFFFF' : '#000000'}">Friend</div>
                    <div style="font-size: 12px; color: #666">Online now</div>
                </div>
            </div>
            <div class="preview-messages" style="padding: 20px; min-height: 300px;">
                ${messagesHTML}
            </div>
            <div class="preview-input" style="padding: 10px; background-color: ${platform === 'dark' ? '#1A1A1A' : '#FFFFFF'}; border-radius: 0 0 10px 10px; display: flex;">
                <input type="text" placeholder="Type a message..." style="flex: 1; padding: 10px; border: 1px solid #DDD; border-radius: 20px; margin-right: 10px;" disabled>
                <button style="background-color: ${colors.sent}; color: white; border: none; border-radius: 50%; width: 40px; height: 40px;" disabled>↑</button>
            </div>
        </div>
    `;
}

function generateRandomTime() {
    const hour = Math.floor(Math.random() * 12) + 1;
    const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
    const ampm = Math.random() > 0.5 ? 'AM' : 'PM';
    return `${hour}:${minute} ${ampm}`;
}

// ===== EXPORT FUNCTIONS =====
downloadPngBtn.addEventListener('click', () => {
    showToast('PNG download started! (Demo)', 'success');
    // In a real implementation, you would use html2canvas library
});

copyHtmlBtn.addEventListener('click', () => {
    const previewHTML = livePreview.innerHTML;
    navigator.clipboard.writeText(previewHTML)
        .then(() => showToast('HTML copied to clipboard!', 'success'))
        .catch(() => showToast('Failed to copy HTML', 'error'));
});

shareLinkBtn.addEventListener('click', () => {
    showToast('Share link generated! (Demo)', 'success');
    // In a real implementation, you would generate a unique shareable link
});

// ===== TEMPLATES SYSTEM =====
const templates = [
    { id: 1, name: "Business Deal", category: "business", 
      description: "Professional conversation between colleagues discussing a project" },
    { id: 2, name: "Funny Memes", category: "funny", 
      description: "Friends sharing hilarious memes and jokes" },
    { id: 3, name: "Dating App", category: "dating", 
      description: "Awkward yet funny dating app conversation" },
    { id: 4, name: "Drama Alert", category: "drama", 
      description: "Over-the-top dramatic conversation full of emotions" },
    { id: 5, name: "Social Media Hype", category: "social", 
      description: "Friends discussing viral social media trends" },
    { id: 6, name: "Tech Support", category: "business", 
      description: "Frustrated user talking to tech support" },
    { id: 7, name: "Secret Admirer", category: "drama", 
      description: "Mysterious admirer confessing feelings" },
    { id: 8, name: "Group Project", category: "business", 
      description: "Students planning a group project last minute" }
];

function loadTemplates(filter = 'all') {
    templateGrid.innerHTML = '';
    
    const filteredTemplates = filter === 'all' 
        ? templates 
        : templates.filter(t => t.category === filter);
    
    filteredTemplates.forEach(template => {
        const templateCard = document.createElement('div');
        templateCard.className = 'template-card';
        templateCard.innerHTML = `
            <div class="template-image">
                <i class="fas fa-comments"></i>
            </div>
            <div class="template-content">
                <div class="template-tags">
                    <span class="template-tag ${template.category}">${template.category}</span>
                </div>
                <h4>${template.name}</h4>
                <p>${template.description}</p>
                <button class="btn-secondary use-template" data-id="${template.id}">
                    Use Template
                </button>
            </div>
        `;
        templateGrid.appendChild(templateCard);
    });
    
    // Add event listeners to use template buttons
    document.querySelectorAll('.use-template').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const templateId = parseInt(e.target.dataset.id);
            useTemplate(templateId);
        });
    });
}

function useTemplate(templateId) {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    // Clear current messages
    messageList.innerHTML = '';
    
    // Add template-specific messages
    const templateMessages = getTemplateMessages(templateId);
    templateMessages.forEach((msg, index) => {
        setTimeout(() => {
            const messageItem = document.createElement('div');
            messageItem.className = 'message-item';
            messageItem.innerHTML = `
                <span>${msg.sender}: ${msg.text}</span>
                <button class="btn-remove-message">&times;</button>
            `;
            
            messageList.appendChild(messageItem);
            
            const removeBtn = messageItem.querySelector('.btn-remove-message');
            removeBtn.addEventListener('click', () => {
                messageItem.remove();
                updatePreview();
            });
            
            if (index === templateMessages.length - 1) {
                updatePreview();
                showToast(`"${template.name}" template loaded!`, 'success');
            }
        }, index * 100);
    });
}

function getTemplateMessages(templateId) {
    const messageSets = {
        1: [
            { sender: 'You', text: 'Hi John, do you have a minute to discuss the Q3 projections?' },
            { sender: 'Friend', text: 'Sure, I just finished reviewing the numbers.' },
            { sender: 'You', text: 'Great! I think we need to adjust our targets based on the market trends.' },
            { sender: 'Friend', text: 'Agreed. I\'ve prepared a presentation for tomorrow\'s meeting.' }
        ],
        2: [
            { sender: 'Friend', text: 'OMG you have to see this meme 😂' },
            { sender: 'You', text: 'LOL where do you find these?' },
            { sender: 'Friend', text: 'The internet is a magical place 🧙‍♂️' },
            { sender: 'You', text: 'I\'m sending this to everyone I know' }
        ],
        3: [
            { sender: 'You', text: 'So... you come here often?' },
            { sender: 'Friend', text: 'Just looking for my soulmate 👀' },
            { sender: 'You', text: 'Found them yet?' },
            { sender: 'Friend', text: 'Maybe... 😏' }
        ],
        4: [
            { sender: 'Friend', text: 'I CANNOT believe what just happened!!!' },
            { sender: 'You', text: 'What?? Tell me everything!' },
            { sender: 'Friend', text: 'It\'s a long story... my life is literally a movie right now' },
            { sender: 'You', text: 'OMG I need all the tea ☕️' }
        ]
    };
    
    return messageSets[templateId] || messageSets[1];
}

// Template filtering
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadTemplates(btn.dataset.filter);
    });
});

loadMoreTemplatesBtn.addEventListener('click', () => {
    showToast('Loading more templates... (Demo)', 'info');
});

// ===== PRICING TOGGLE =====
function initializePricingToggle() {
    pricingToggle.addEventListener('change', updatePricing);
}

function updatePricing() {
    const isYearly = pricingToggle.checked;
    
    pricingAmounts.forEach(amountEl => {
        const monthlyPrice = amountEl.dataset.monthly;
        const yearlyPrice = amountEl.dataset.yearly;
        
        amountEl.textContent = isYearly ? yearlyPrice : monthlyPrice;
    });
}

// ===== TOAST SYSTEM =====
function initializeToast() {
    toastClose.addEventListener('click', () => {
        toast.classList.remove('show');
    });
    
    // Auto-hide toast after 3 seconds
    toast.addEventListener('animationend', () => {
        if (toast.classList.contains('show')) {
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    });
}

function showToast(message, type = 'info') {
    toastMessage.textContent = message;
    toast.className = 'toast';
    toast.classList.add('show', type);
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ===== MOBILE MENU TOGGLE =====
const menuToggle = document.querySelector('.menu-toggle');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
}

// ===== FORM SUBMISSION PREVENTION =====
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Form submitted! (Demo)', 'success');
    });
});

// ===== DARK/LIGHT THEME SUPPORT =====
const themeSelect = document.getElementById('theme-select');
if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
        const theme = e.target.value;
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else if (theme === 'light') {
            document.body.classList.remove('dark-theme');
        } else {
            // Auto theme based on system preference
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        }
    });
}
