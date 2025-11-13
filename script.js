// Array to store participants
let participants = [];

// DOM Elements
const participantForm = document.getElementById('participantForm');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const participantsList = document.getElementById('participantsList');
const participantCount = document.getElementById('participantCount');
const raffleButton = document.getElementById('raffleButton');
const winnerDisplay = document.getElementById('winnerDisplay');
const winnerName = document.getElementById('winnerName');
const winnerPhone = document.getElementById('winnerPhone');

// Load participants from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    loadParticipants();
    updateParticipantsList();
    updateRaffleButton();
});

// Form submission handler
participantForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    
    if (name && phone) {
        addParticipant(name, phone);
        participantForm.reset();
        nameInput.focus();
    }
});

// Raffle button click handler
raffleButton.addEventListener('click', () => {
    if (participants.length > 0) {
        performRaffle();
    }
});

// Add a new participant
function addParticipant(name, phone) {
    const participant = {
        id: Date.now(),
        name: name,
        phone: phone
    };
    
    participants.push(participant);
    saveParticipants();
    updateParticipantsList();
    updateRaffleButton();
    
    // Show success message
    showNotification(`¡${name} ha sido agregado al sorteo!`);
}

// Update the participants list display
function updateParticipantsList() {
    participantCount.textContent = participants.length;
    
    if (participants.length === 0) {
        participantsList.innerHTML = '<p class="empty-message">Aún no hay participantes. ¡Sé el primero!</p>';
    } else {
        participantsList.innerHTML = '';
        participants.forEach((participant, index) => {
            const participantElement = document.createElement('div');
            participantElement.className = 'participant-item';
            participantElement.innerHTML = `
                <strong>#${index + 1} - ${participant.name}</strong>
                <span>📞 ${participant.phone}</span>
            `;
            participantsList.appendChild(participantElement);
        });
    }
}

// Update raffle button state
function updateRaffleButton() {
    if (participants.length > 0) {
        raffleButton.disabled = false;
        raffleButton.textContent = `🎲 Sortear Ganador (${participants.length} participantes)`;
    } else {
        raffleButton.disabled = true;
        raffleButton.textContent = '🎲 Sortear Ganador';
    }
}

// Perform the raffle
function performRaffle() {
    // Hide previous winner if any
    winnerDisplay.classList.add('hidden');
    
    // Disable raffle button during animation
    raffleButton.disabled = true;
    raffleButton.textContent = '🎲 Sorteando...';
    
    // Simulate raffle animation
    let counter = 0;
    const animationInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * participants.length);
        const tempParticipant = participants[randomIndex];
        winnerName.textContent = tempParticipant.name;
        winnerPhone.textContent = `📞 ${tempParticipant.phone}`;
        counter++;
        
        if (counter > 20) {
            clearInterval(animationInterval);
            // Select final winner
            const winnerIndex = Math.floor(Math.random() * participants.length);
            const winner = participants[winnerIndex];
            
            winnerName.textContent = winner.name;
            winnerPhone.textContent = `📞 ${winner.phone}`;
            winnerDisplay.classList.remove('hidden');
            
            // Scroll to winner
            winnerDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Re-enable raffle button
            raffleButton.disabled = false;
            updateRaffleButton();
            
            // Show notification
            showNotification(`🎉 ¡${winner.name} es el ganador!`);
        }
    }, 100);
}

// Save participants to localStorage
function saveParticipants() {
    localStorage.setItem('raffleParticipants', JSON.stringify(participants));
}

// Load participants from localStorage
function loadParticipants() {
    const stored = localStorage.getItem('raffleParticipants');
    if (stored) {
        try {
            participants = JSON.parse(stored);
        } catch (e) {
            participants = [];
        }
    }
}

// Show notification (simple implementation)
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        font-weight: bold;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
