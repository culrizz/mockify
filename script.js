// ===== MOCKIFY - MAIN SCRIPT =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mockify loaded successfully! 🚀');
    
    // Initialize all components
    initTabSwitching();
    initSidebar();
    initChatGenerator();
    initTemplates();
    initExportFunctions();
    initFormatters();
    initRandomData();
    initMobilePreview();
    
    // Set initial chat
    updateChatPreview();
});

// ===== TAB & SIDEBAR FUNCTIONALITY =====
function initTabSwitching() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sidebarBtns = document.querySelectorAll('.sidebar-btn[data-tool]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            // Here you would load different sections
            showNotification('Feature coming soon!', 'info');
        });
    });
    
    sidebarBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tool = this.dataset.tool;
            sidebarBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            switchTool(tool);
        });
    });
    
    // Quick action buttons
    document.getElementById('quick-random').addEventListener('click', generateRandomChat);
    document.getElementById('quick-screenshot').addEventListener('click', takeScreenshot);
    document.getElementById('quick-template').addEventListener('click', showTemplates);
}

function initSidebar() {
    // Tool switching
    function switchTool(tool) {
        const toolHeader = document.querySelector('.tool-header h2');
        const toolIcon = document.querySelector('.tool-header i');
        
        switch(tool) {
            case 'whatsapp':
                toolHeader.innerHTML = '<i class="fab fa-whatsapp"></i> WhatsApp Chat Generator';
                showNotification('Switched to WhatsApp generator', 'success');
                break;
            case 'instagram':
                toolHeader.innerHTML = '<i class="fab fa-instagram"></i> Instagram DM Generator';
                showNotification('Switched to Instagram generator', 'success');
                break;
            case 'facebook':
                toolHeader.innerHTML = '<i class="fab fa-facebook-messenger"></i> Messenger Generator';
                showNotification('Switched to Facebook Messenger', 'info');
                break;
            case 'telegram':
                toolHeader.innerHTML = '<i class="fab fa-telegram"></i> Telegram Generator';
                showNotification('Switched to Telegram', 'info');
                break;
            case 'sms':
                toolHeader.innerHTML = '<i class="fas fa-sms"></i> SMS Generator';
                showNotification('Switched to SMS generator', 'info');
                break;
        }
        
        // Update chat preview for selected tool
        updateChatPreview();
    }
    
    // Attach event listeners to sidebar buttons
    document.querySelectorAll('.sidebar-btn[data-tool]').forEach(btn => {
        btn.addEventListener('click', function() {
            const tool = this.dataset.tool;
            document.querySelectorAll('.sidebar-btn[data-tool]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            switchTool(tool);
        });
    });
}

// ===== CHAT GENERATOR CORE =====
function initChatGenerator() {
    // Get all input elements
    const contactName = document.getElementById('contact-name');
    const userName = document.getElementById('user-name');
    const chatStatus = document.getElementById('chat-status');
    const chatTheme = document.getElementById('chat-theme');
    const chatConversation = document.getElementById('chat-conversation');
    const messageCount = document.getElementById('message-count');
    const countDisplay = document.getElementById('count-display');
    
    // Update message count display
    messageCount.addEventListener('input', function() {
        countDisplay.textContent = this.value;
    });
    
    // Auto-update preview on input
    const inputs = [contactName, userName, chatStatus, chatConversation];
    inputs.forEach(input => {
        input.addEventListener('input', debounce(updateChatPreview, 300));
    });
    
    // Button event listeners
    document.getElementById('btn-randomize').addEventListener('click', generateRandomChat);
    document.getElementById('btn-preview').addEventListener('click', updateChatPreview);
    document.getElementById('btn-download').addEventListener('click', downloadChatScreenshot);
    document.getElementById('btn-refresh').addEventListener('click', updateChatPreview);
    document.getElementById('btn-screenshot').addEventListener('click', downloadChatScreenshot);
    document.getElementById('btn-copy').addEventListener('click', copyChatText);
    document.getElementById('btn-share').addEventListener('click', shareChat);
    
    // Format help button
    document.getElementById('format-help').addEventListener('click', function() {
        showNotification('Format: Name: Message (one per line)\nExample:\nYou: Hello!\nJohn: Hi there!', 'info', 5000);
    });
    
    // Save and share buttons
    document.getElementById('save-template').addEventListener('click', saveAsTemplate);
    document.getElementById('share-chat').addEventListener('click', shareChat);
    document.getElementById('export-all').addEventListener('click', exportAllFormats);
}

// ===== CHAT PREVIEW RENDERER =====
function updateChatPreview() {
    const contact = document.getElementById('contact-name').value || 'Alex Johnson';
    const user = document.getElementById('user-name').value || 'You';
    const status = document.getElementById('chat-status').value || 'Online';
    const conversation = document.getElementById('chat-conversation').value;
    const theme = document.getElementById('chat-theme').value;
    
    // Parse conversation
    const messages = parseConversation(conversation, user);
    
    // Update stats
    updateStats(messages.length, contact, user);
    
    // Determine which tool is active
    const activeTool = document.querySelector('.sidebar-btn[data-tool].active')?.dataset.tool || 'whatsapp';
    
    // Render appropriate chat
    const previewContainer = document.getElementById('chat-preview');
    
    if (activeTool === 'whatsapp') {
        previewContainer.innerHTML = renderWhatsAppChat(contact, user, status, messages, theme);
    } else if (activeTool === 'instagram') {
        previewContainer.innerHTML = renderInstagramChat(contact, user, status, messages, theme);
    } else {
        previewContainer.innerHTML = renderGenericChat(contact, user, status, messages, activeTool);
    }
    
    // Add message animations
    setTimeout(() => {
        document.querySelectorAll('.message').forEach((msg, index) => {
            msg.style.animationDelay = `${index * 100}ms`;
            msg.classList.add('animate-in');
        });
    }, 100);
    
    // Update theme
    applyTheme(theme);
    
    showNotification('Preview updated!', 'success');
}

function parseConversation(text, currentUser) {
    const messages = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    // Generate base time
    let baseTime = new Date();
    baseTime.setMinutes(baseTime.getMinutes() - lines.length);
    
    lines.forEach((line, index) => {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) return;
        
        const sender = line.substring(0, colonIndex).trim();
        const text = line.substring(colonIndex + 1).trim();
        
        if (sender && text) {
            // Calculate time for this message
            const messageTime = new Date(baseTime);
            messageTime.setMinutes(messageTime.getMinutes() + index);
            
            const timeStr = messageTime.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            messages.push({
                sender,
                text,
                time: timeStr,
                isUser: sender === currentUser,
                hasEmoji: /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(text)
            });
        }
    });
    
    return messages;
}

function renderWhatsAppChat(contact, user, status, messages, theme) {
    const isDark = theme === 'Dark';
    
    return `
        <div class="whatsapp-chat ${isDark ? 'dark-theme' : ''}">
            <div class="chat-header">
                <div class="chat-back"><i class="fas fa-arrow-left"></i></div>
                <div class="chat-contact">
                    <div class="chat-name">${contact}</div>
                    <div class="chat-status">
                        <i class="fas fa-circle"></i> ${status}
                    </div>
                </div>
                <div class="chat-actions">
                    <i class="fas fa-video"></i>
                    <i class="fas fa-phone"></i>
                    <i class="fas fa-ellipsis-v"></i>
                </div>
            </div>
            
            <div class="chat-messages">
                <div class="chat-date">
                    <span>Today</span>
                </div>
                
                ${messages.map((msg, index) => `
                    <div class="message ${msg.isUser ? 'sent' : 'received'}" data-index="${index}">
                        <div class="message-bubble">
                            <div class="message-text">${formatMessageText(msg.text)}</div>
                            <div class="message-meta">
                                <span class="message-time">${msg.time}</span>
                                ${msg.isUser ? '<i class="fas fa-check-double"></i>' : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
                
                <div class="typing-indicator">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <span>${contact} is typing...</span>
                </div>
            </div>
            
            <div class="chat-input-area">
                <div class="input-actions">
                    <i class="fas fa-plus-circle"></i>
                    <i class="fas fa-image"></i>
                    <i class="fas fa-camera"></i>
                </div>
                <div class="message-input" contenteditable="true" placeholder="Type a message">Type a message</div>
                <div class="send-button">
                    <i class="fas fa-microphone"></i>
                </div>
            </div>
        </div>
    `;
}

function renderInstagramChat(contact, user, status, messages, theme) {
    const contactInitial = contact.charAt(0).toUpperCase();
    
    return `
        <div class="instagram-chat">
            <div class="chat-header">
                <div class="chat-back"><i class="fas fa-arrow-left"></i></div>
                <div class="chat-contact">
                    <div class="chat-avatar" style="background: linear-gradient(45deg, #405DE6, #C13584);">${contactInitial}</div>
                    <div>
                        <div class="chat-name">${contact}</div>
                        <div class="chat-status">${status}</div>
                    </div>
                </div>
                <div class="chat-actions">
                    <i class="fas fa-video"></i>
                    <i class="fas fa-info-circle"></i>
                </div>
            </div>
            
            <div class="chat-messages">
                <div class="chat-date">
                    <span>Today</span>
                </div>
                
                ${messages.map((msg, index) => `
                    <div class="message ${msg.isUser ? 'sent' : 'received'}" data-index="${index}">
                        <div class="message-bubble">
                            <div class="message-text">${formatMessageText(msg.text)}</div>
                            <div class="message-meta">
                                <span class="message-time">${msg.time}</span>
                                ${msg.hasEmoji ? '<i class="fas fa-smile"></i>' : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
                
                <div class="active-now">
                    <div class="active-dot"></div>
                    <span>${contact} is active now</span>
                </div>
            </div>
            
            <div class="chat-input-area">
                <div class="message-input" contenteditable="true" placeholder="Message...">Message...</div>
                <div class="input-actions">
                    <i class="fas fa-camera"></i>
                    <i class="fas fa-image"></i>
                    <i class="fas fa-heart"></i>
                </div>
                <div class="send-button">
                    <i class="fas fa-paper-plane"></i>
                </div>
            </div>
        </div>
    `;
}

function renderGenericChat(contact, user, status, messages, platform) {
    const platformNames = {
        'facebook': 'Facebook Messenger',
        'telegram': 'Telegram',
        'sms': 'SMS'
    };
    
    return `
        <div class="generic-chat ${platform}">
            <div class="chat-header">
                <div class="chat-back"><i class="fas fa-arrow-left"></i></div>
                <div class="chat-contact">
                    <div class="chat-name">${contact}</div>
                    <div class="chat-status">${platformNames[platform] || platform} • ${status}</div>
                </div>
                <div class="chat-actions">
                    <i class="fas fa-ellipsis-v"></i>
                </div>
            </div>
            
            <div class="chat-messages">
                ${messages.map((msg, index) => `
                    <div class="message ${msg.isUser ? 'sent' : 'received'}" data-index="${index}">
                        <div class="message-bubble">
                            <div class="message-text">${formatMessageText(msg.text)}</div>
                            <div class="message-meta">
                                <span class="message-time">${msg.time}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="chat-input-area">
                <div class="message-input" contenteditable="true" placeholder="Type a message">Type a message</div>
                <div class="send-button">
                    <i class="fas fa-paper-plane"></i>
                </div>
            </div>
        </div>
    `;
}

// ===== RANDOM CHAT GENERATOR =====
function generateRandomChat() {
    const chatTypes = [
        'business',
        'casual',
        'friends',
        'family',
        'support',
        'flirty',
        'planning'
    ];
    
    const selectedType = chatTypes[Math.floor(Math.random() * chatTypes.length)];
    const randomData = generateRandomConversation(selectedType);
    
    // Update form fields
    document.getElementById('contact-name').value = randomData.contact;
    document.getElementById('user-name').value = randomData.user;
    document.getElementById('chat-conversation').value = randomData.conversation;
    
    // Update status randomly
    const statuses = ['Online', 'Last seen recently', 'Typing...', 'Active now'];
    document.getElementById('chat-status').value = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Update preview
    updateChatPreview();
    
    showNotification(`Random ${selectedType} chat generated!`, 'success');
}

function generateRandomConversation(type) {
    const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Skyler'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    
    const contactName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    const userName = 'You';
    
    // Conversation templates by type
    const templates = {
        'business': [
            `${contactName}: Hi, do you have a moment to discuss the project?`,
            `${userName}: Yes, of course. What's on your mind?`,
            `${contactName}: I've reviewed the proposal and have some feedback`,
            `${userName}: I'd love to hear your thoughts`,
            `${contactName}: Let's schedule a meeting for tomorrow`,
            `${userName}: Perfect. 2 PM works for me`,
            `${contactName}: Great! I'll send the calendar invite`,
            `${userName}: Looking forward to it`
        ],
        'casual': [
            `${contactName}: Hey! What are you up to?`,
            `${userName}: Just relaxing. How about you?`,
            `${contactName}: Same here. Bored 😅`,
            `${userName}: Want to grab coffee later?`,
            `${contactName}: That sounds great!`,
            `${userName}: How about 4 PM?`,
            `${contactName}: Perfect! See you then ☕`,
            `${userName}: Can't wait! 😊`
        ],
        'friends': [
            `${contactName}: DUDE you won't believe what happened`,
            `${userName}: What?? Tell me!`,
            `${contactName}: I ran into Sarah at the mall`,
            `${userName}: NO WAY! How is she?`,
            `${contactName}: She looks amazing! We talked for hours`,
            `${userName}: That's awesome! We should all hang out`,
            `${contactName}: YES! Let's plan something`,
            `${userName}: I'm so down for that! 🙌`
        ],
        'support': [
            `${contactName}: Hi, I'm having trouble with my account`,
            `${userName}: I'd be happy to help! What seems to be the issue?`,
            `${contactName}: I can't reset my password`,
            `${userName}: Let me help you with that`,
            `${contactName}: The reset link isn't working`,
            `${userName}: I'll generate a new one for you`,
            `${contactName}: Thank you so much!`,
            `${userName}: You should receive an email shortly`
        ]
    };
    
    const conversation = templates[type] || templates['casual'];
    
    // Randomly add some emojis
    const emojis = ['😊', '😂', '👍', '👌', '🎉', '🤔', '😅', '🙏'];
    const conversationWithEmojis = conversation.map(line => {
        if (Math.random() > 0.7) {
            return line + ' ' + emojis[Math.floor(Math.random() * emojis.length)];
        }
        return line;
    });
    
    return {
        contact: contactName,
        user: userName,
        conversation: conversationWithEmojis.join('\n')
    };
}

// ===== EXPORT & DOWNLOAD FUNCTIONS =====
function initExportFunctions() {
    // Screenshot functionality
    async function takeScreenshot() {
        const preview = document.getElementById('chat-preview');
        if (!preview || !preview.children.length) {
            showNotification('No chat to screenshot!', 'error');
            return;
        }
        
        try {
            showNotification('Taking screenshot...', 'info');
            
            // Use html2canvas if available
            if (typeof html2canvas !== 'undefined') {
                const canvas = await html2canvas(preview, {
                    scale: 2,
                    backgroundColor: null,
                    useCORS: true,
                    logging: false
                });
                
                const link = document.createElement('a');
                link.download = `mockify-chat-${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                
                showNotification('Screenshot downloaded!', 'success');
            } else {
                // Fallback: Copy to clipboard
                navigator.clipboard.writeText(
                    `Mockify Chat: ${document.getElementById('contact-name').value}\n\n` +
                    document.getElementById('chat-conversation').value
                ).then(() => {
                    showNotification('Chat copied to clipboard!', 'success');
                });
            }
        } catch (error) {
            console.error('Screenshot error:', error);
            showNotification('Failed to take screenshot', 'error');
        }
    }
    
    // Attach screenshot function to all relevant buttons
    document.getElementById('quick-screenshot').addEventListener('click', takeScreenshot);
    document.getElementById('btn-screenshot').addEventListener('click', takeScreenshot);
}

function downloadChatScreenshot() {
    const preview = document.getElementById('chat-preview');
    const contact = document.getElementById('contact-name').value || 'chat';
    
    if (!preview || !preview.children.length) {
        showNotification('Generate a chat first!', 'error');
        return;
    }
    
    showNotification('Preparing download...', 'info');
    
    // Use html2canvas for screenshot
    html2canvas(preview, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `mockify-${contact.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showNotification('Screenshot downloaded!', 'success');
    }).catch(error => {
        console.error('Download error:', error);
        showNotification('Download failed. Try again.', 'error');
    });
}

function copyChatText() {
    const conversation = document.getElementById('chat-conversation').value;
    const contact = document.getElementById('contact-name').value;
    
    const textToCopy = `Chat with ${contact}:\n\n${conversation}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification('Chat copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Copy failed:', err);
        showNotification('Failed to copy text', 'error');
    });
}

function shareChat() {
    const conversation = document.getElementById('chat-conversation').value;
    const contact = document.getElementById('contact-name').value;
    
    const shareText = `Check out this fake chat I made with ${contact} using Mockify!\n\n${conversation}\n\nGenerated with Mockify - Fake Chat Generator`;
    
    if (navigator.share) {
        navigator.share({
            title: `Chat with ${contact}`,
            text: shareText,
            url: window.location.href
        }).then(() => {
            showNotification('Shared successfully!', 'success');
        }).catch(err => {
            console.error('Share failed:', err);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

function fallbackShare(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Share text copied to clipboard!', 'success');
    });
}

function exportAllFormats() {
    showNotification('Exporting all formats...', 'info');
    
    // In a real app, you would export:
    // 1. PNG screenshot
    // 2. JSON data
    // 3. Text file
    // 4. HTML embed
    
    setTimeout(() => {
        showNotification('Export complete! Check your downloads.', 'success');
    }, 1500);
}

// ===== TEMPLATES =====
function initTemplates() {
    const templateCards = document.querySelectorAll('.template-card');
    
    templateCards.forEach(card => {
        card.addEventListener('click', function() {
            const templateType = this.dataset.template;
            loadTemplate(templateType);
            
            // Visual feedback
            templateCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            setTimeout(() => {
                this.classList.remove('active');
            }, 1000);
        });
    });
}

function loadTemplate(templateType) {
    const templates = {
        'business': {
            contact: 'David Wilson (CEO)',
            user: 'You',
            status: 'Online',
            conversation: `David Wilson (CEO): We need to discuss Q4 projections\nYou: I have the reports ready for review\nDavid Wilson (CEO): Perfect. Let's schedule a board meeting\nYou: How about Wednesday at 10 AM?\nDavid Wilson (CEO): That works. Send the invites\nYou: Will do. Should I include the financial team?\nDavid Wilson (CEO): Yes, please include everyone\nYou: Consider it done 👍`
        },
        'friends': {
            contact: 'Sarah & Friends',
            user: 'You',
            status: '6 members',
            conversation: `Sarah: Movie night this weekend! 🎬\nMike: Count me in!\nYou: What movie are we watching?\nEmma: I vote for something scary 👻\nAlex: Nooo not horror! 😱\nSarah: How about a comedy?\nYou: I'm down for anything!\nMike: Pizza at my place? 🍕\nEveryone: YES!`
        },
        'family': {
            contact: 'Family Group 👨‍👩‍👧‍👦',
            user: 'You',
            status: '12 members',
            conversation: `Mom: Who's coming for Sunday dinner?\nDad: We all better be there! 😊\nYou: I'll be there! What should I bring?\nSister: I'm making dessert 🍰\nBrother: I'll bring drinks 🥤\nMom: Perfect! Can't wait to see everyone\nGrandma: Save me some pie! 🥧\nYou: Always, Grandma! ❤️`
        },
        'support': {
            contact: 'Customer Support',
            user: 'You',
            status: 'Typically replies in 5 minutes',
            conversation: `You: Hi, I'm having trouble logging in\nCustomer Support: I'd be happy to help! Can you tell me more?\nYou: It says my password is incorrect\nCustomer Support: Let me reset it for you\nYou: Thank you!\nCustomer Support: Check your email for the reset link\nYou: Got it! Working now\nCustomer Support: Great! Is there anything else?\nYou: No, thank you for your help!`
        }
    };
    
    const template = templates[templateType];
    if (!template) return;
    
    // Apply template
    document.getElementById('contact-name').value = template.contact;
    document.getElementById('user-name').value = template.user;
    document.getElementById('chat-status').value = template.status;
    document.getElementById('chat-conversation').value = template.conversation;
    
    // Update preview
    updateChatPreview();
    
    showNotification(`Loaded ${templateType} template!`, 'success');
}

function saveAsTemplate() {
    const contact = document.getElementById('contact-name').value;
    const conversation = document.getElementById('chat-conversation').value;
    
    if (!contact.trim() || !conversation.trim()) {
        showNotification('Cannot save empty chat!', 'error');
        return;
    }
    
    // In a real app, save to localStorage or backend
    const templateName = prompt('Enter a name for this template:');
    if (templateName) {
        // Save logic here
        showNotification(`Template "${templateName}" saved!`, 'success');
    }
}

function showTemplates() {
    document.querySelector('.templates-section').scrollIntoView({
        behavior: 'smooth'
    });
    showNotification('Browse templates below 👇', 'info');
}

// ===== UTILITY FUNCTIONS =====
function initFormatters() {
    // Format message text (detect links, bold, etc.)
    window.formatMessageText = function(text) {
        // Convert URLs to links
        text = text.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank" class="message-link">$1</a>'
        );
        
        // Convert *bold* to <strong>
        text = text.replace(
            /\*([^*]+)\*/g,
            '<strong>$1</strong>'
        );
        
        // Convert _italic_ to <em>
        text = text.replace(
            /_([^_]+)_/g,
            '<em>$1</em>'
        );
        
        return text;
    };
}

function initRandomData() {
    // Add faker.js-like functionality if not available
    if (typeof faker === 'undefined') {
        window.faker = {
            person: {
                firstName: () => ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey'][Math.floor(Math.random() * 5)],
                lastName: () => ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]
            },
            lorem: {
                sentence: () => 'This is a randomly generated sentence for testing purposes.'
            }
        };
    }
}

function initMobilePreview() {
    const previewBtns = document.querySelectorAll('.preview-btn[data-view]');
    
    previewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            const deviceFrame = document.querySelector('.device-frame');
            
            previewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (view === 'desktop') {
                deviceFrame.style.maxWidth = '800px';
                deviceFrame.style.borderRadius = '20px';
                deviceFrame.querySelector('.device-screen').style.borderRadius = '15px';
            } else {
                deviceFrame.style.maxWidth = '320px';
                deviceFrame.style.borderRadius = '30px';
                deviceFrame.querySelector('.device-screen').style.borderRadius = '20px';
            }
        });
    });
}

function updateStats(messageCount, contact, user) {
    const stats = document.querySelectorAll('.stat strong');
    if (stats.length >= 3) {
        stats[0].textContent = messageCount;
        stats[2].textContent = '2'; // Participants
    }
    
    // Update time span (random between 1 min to 2 hours)
    const timeSpan = Math.floor(Math.random() * 120) + 1;
    const timeText = timeSpan < 60 ? `${timeSpan} min` : `${Math.floor(timeSpan / 60)}h ${timeSpan % 60}min`;
    
    if (stats[1]) {
        stats[1].textContent = timeText;
    }
}

function applyTheme(theme) {
    const screen = document.querySelector('.device-screen');
    if (!screen) return;
    
    const themes = {
        'Default': '',
        'Dark': 'dark-theme',
        'Blue': 'blue-theme',
        'Pink': 'pink-theme'
    };
    
    // Remove all theme classes
    Object.values(themes).forEach(themeClass => {
        if (themeClass) screen.classList.remove(themeClass);
    });
    
    // Add selected theme
    if (themes[theme]) {
        screen.classList.add(themes[theme]);
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--dark);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: var(--radius);
                padding: 1rem 1.5rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                z-index: 1000;
                box-shadow: var(--shadow-lg);
                animation: slideIn 0.3s ease;
                max-width: 350px;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                flex: 1;
            }
            .notification-close {
                background: transparent;
                border: none;
                color: var(--gray);
                cursor: pointer;
                padding: 0.25rem;
            }
            .notification-success {
                border-left: 4px solid var(--success);
            }
            .notification-error {
                border-left: 4px solid var(--danger);
            }
            .notification-info {
                border-left: 4px solid var(--info);
            }
            .notification-warning {
                border-left: 4px solid var(--warning);
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove
    const autoRemove = setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Add slideOut animation
    if (!document.querySelector('#notification-animations')) {
        const anim = document.createElement('style');
        anim.id = 'notification-animations';
        anim.textContent = '@keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }';
        document.head.appendChild(anim);
    }
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// ===== DEBOUNCE HELPER =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== ADDITIONAL CSS FOR INTERACTIVE ELEMENTS =====
// Add this to your style.css or create a new animations.css
const interactiveStyles = `
/* Add these to your style.css file */

/* Message animations */
.message {
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s, transform 0.3s;
}

.message.animate-in {
    opacity: 1;
    transform: translateY(0);
}

/* Chat bubble styles */
.message-bubble {
    max-width: 70%;
    padding: 10px 15px;
    border-radius: 18px;
    position: relative;
    word-wrap: break-word;
}

.message.sent .message-bubble {
    background: #DCF8C6;
    color: #000;
    margin-left: auto;
    border-bottom-right-radius: 4px;
}

.message.received .message-bubble {
    background: white;
    color: #000;
    margin-right: auto;
    border-bottom-left-radius: 4px;
}

/* Dark theme */
.dark-theme .message.sent .message-bubble {
    background: #056162;
    color: white;
}

.dark-theme .message.received .message-bubble {
    background: #262D31;
    color: white;
}

/* Typing indicator */
.typing-indicator {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 15px;
    background: white;
    border-radius: 18px;
    width: fit-content;
    margin-top: 10px;
    opacity: 0.8;
}

.typing-dots {
    display: flex;
    gap: 4px;
}

.typing-dots span {
    width: 8px;
    height: 8px;
    background: #999;
    border-radius: 50%;
    animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-5px); }
}

/* Active now indicator */
.active-now {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #999;
    font-size: 0.9rem;
    margin-top: 10px;
}

.active-dot {
    width: 8px;
    height: 8px;
    background: #10B981;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

/* Chat input area */
.chat-input-area {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: #F0F0F0;
}

.message-input[contenteditable="true"] {
    flex: 1;
    background: white;
    border-radius: 20px;
    padding: 10px 15px;
    min-height: 20px;
    max-height: 100px;
    overflow-y: auto;
    outline: none;
}

.message-input[contenteditable="true"]:empty:before {
    content: attr(placeholder);
    color: #999;
}

/* Send button */
.send-button {
    width: 40px;
    height: 40px;
    background: #25D366;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.3s;
}

.send-button:hover {
    background: #128C7E;
}

/* Link styling in messages */
.message-link {
    color: #007AFF;
    text-decoration: underline;
    word-break: break-all;
}

/* Template card active state */
.template-card.active {
    transform: scale(1.05);
    box-shadow: 0 10px 25px rgba(124, 58, 237, 0.3);
    border-color: var(--primary);
}

/* Range input styling */
input[type="range"] {
    -webkit-appearance: none;
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    outline: none;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: var(--primary);
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: var(--shadow);
}

/* Select dropdown styling */
select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%236B7280' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 12px;
    padding-right: 2.5rem;
    cursor: pointer;
}

/* Editor toolbar */
.editor-toolbar {
    display: flex;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    gap: 0.25rem;
}

.editor-btn {
    background: transparent;
    border: none;
    color: var(--gray);
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.editor-btn:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
}

/* Hover effects */
.btn, .sidebar-btn, .device-btn, .preview-btn {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn:hover, .sidebar-btn:hover, .device-btn:hover, .preview-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

/* Loading states */
.btn.loading {
    position: relative;
    color: transparent;
}

.btn.loading:after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    .generator-area {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .form-row {
        grid-template-columns: 1fr;
    }
    
    .action-buttons {
        flex-direction: column;
    }
    
    .device-frame {
        max-width: 280px !important;
        padding: 15px;
    }
    
    .device-screen {
        min-height: 400px;
    }
}

/* Print styles */
@media print {
    .sidebar, .tool-actions, .action-buttons, .device-actions {
        display: none !important;
    }
    
    .generator-area {
        grid-template-columns: 1fr;
    }
    
    .device-frame {
        max-width: 100% !important;
        border: none !important;
        padding: 0 !important;
        border-radius: 0 !important;
    }
    
    .device-screen {
        border-radius: 0 !important;
        min-height: auto;
    }
}
`;

// Add the interactive styles to the page
if (document.head) {
    const styleEl = document.createElement('style');
    styleEl.textContent = interactiveStyles;
    document.head.appendChild(styleEl);
}
