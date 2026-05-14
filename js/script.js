// ZAP ZAAP - Game

const customerImages = [
    'images/customer-red.png',
    'images/customer-blue.png',
    'images/customer-yellow.png'
];

const customerOrders = [
    'I\'m starving today, please make Somtum extra delicious!',
    'Hello chef! My stomach brought me here again, Somtum please!',
    'Happy Thursday! I need spicy papaya salad to survive today.',
    'Can I get a papaya salad and emotional support?',
    'If this papaya salad isn\'t spicy, I want a refund on my tears.',
    'My stomach said no, but my heart said papaya salad.'
];

// Initialize total money variable
let totalMoney;

// Check if we're on the game page (not the home page)
const isGamePage = !!document.getElementById('moneyBox');

// Detect if this is a page reload
// performance.navigation.type: 0 = navigate, 1 = reload, 2 = back/forward, 255 = reserved
const isPageReload = performance.navigation && performance.navigation.type === 1;

// Check if this is a page reload or intentional navigation
if (isGamePage) {
    const intentionalNav = sessionStorage.getItem('intentionalNavigation');
    const comingFromCooking = sessionStorage.getItem('customerSlideDown') === 'true' || 
                              sessionStorage.getItem('moneyEarned');
    
    if (isPageReload) {
        // This is a page reload, redirect to start page
        totalMoney = 0;
        localStorage.setItem('totalMoney', 0);
        sessionStorage.clear();
        window.location.href = 'index.html';
    } else if (intentionalNav === 'true' || comingFromCooking) {
        // This is intentional navigation (from index.html or from cooking.html)
        sessionStorage.removeItem('intentionalNavigation');
        totalMoney = localStorage.getItem('totalMoney') ? parseInt(localStorage.getItem('totalMoney')) : 0;
        sessionStorage.setItem('gameSession', 'true');
    } else {
        // First time or direct navigation
        totalMoney = localStorage.getItem('totalMoney') ? parseInt(localStorage.getItem('totalMoney')) : 0;
        sessionStorage.setItem('gameSession', 'true');
    }
} else {
    // On index.html or other pages
    totalMoney = localStorage.getItem('totalMoney') ? parseInt(localStorage.getItem('totalMoney')) : 0;
}

document.addEventListener('DOMContentLoaded', function() {
    // Only run game logic if customer element exists (game.html only)
    const customerElement = document.getElementById('customer');
    if (!customerElement) {
        return; // Skip if on home page (index.html)
    }
    
    // Update money display at top
    updateMoneyDisplay();
    
    // Check if customer should slide down (coming from cooking page)
    const shouldSlideDown = sessionStorage.getItem('customerSlideDown');
    const moneyEarned = sessionStorage.getItem('moneyEarned');
    
    if (shouldSlideDown === 'true' && moneyEarned) {
        // Customer is already on the page, slide them down
        customerElement.style.animation = 'slideDown 0.8s ease-out forwards';
        
        // After customer slides down, show money popup
        setTimeout(function() {
            showMoneyPopup(parseInt(moneyEarned));
        }, 800);
        
        // After money popup animation, spawn new customer
        setTimeout(function() {
            customerElement.style.animation = 'slideUp 0.8s ease-out forwards';
            spawnCustomer();
            sessionStorage.removeItem('customerSlideDown');
            sessionStorage.removeItem('moneyEarned');
        }, 2800); // 800ms (slide down) + 2000ms (money popup)
    } else {
        // Normal spawn
        spawnCustomer();
    }
    
    // Add event listener to Receive Order button
    const receiveOrderBtn = document.querySelector('.receive-order-btn');
    if (receiveOrderBtn) {
        receiveOrderBtn.addEventListener('click', function() {
            console.log('Receive Order button clicked');
            sessionStorage.setItem('intentionalNavigation', 'true');
            window.location.href = 'cooking.html';
        });
    }
});

function updateMoneyDisplay() {
    const moneyAmount = document.getElementById('moneyAmount');
    if (moneyAmount) {
        moneyAmount.textContent = totalMoney;
    }
}

function showMoneyPopup(amount) {
    const moneyPopup = document.getElementById('moneyPopup');
    const moneyPopupAmount = document.getElementById('moneyPopupAmount');
    
    // Update money counter
    totalMoney += amount;
    updateMoneyDisplay();
    
    // Save money to localStorage
    localStorage.setItem('totalMoney', totalMoney);
    
    // Show popup
    moneyPopupAmount.textContent = amount;
    moneyPopup.style.display = 'block';
    
    // Hide after animation
    setTimeout(function() {
        moneyPopup.style.display = 'none';
    }, 2000);
    
    console.log(`Earned ${amount}! Total: ${totalMoney}`);
}

function spawnCustomer() {
    // Select random customer
    const randomIndex = Math.floor(Math.random() * customerImages.length);
    const customerImage = customerImages[randomIndex];
    
    // Select random order message
    const randomOrderIndex = Math.floor(Math.random() * customerOrders.length);
    const customerMessage = customerOrders[randomOrderIndex];
    
    const customerElement = document.getElementById('customer');
    customerElement.style.backgroundImage = 'url(' + customerImage + ')';
    
    console.log('Customer spawned:', customerImage);
    console.log('Customer order:', customerMessage);
    
    // Show chat box after customer animation completes (0.8s)
    setTimeout(function() {
        const chatBox = document.getElementById('chatBox');
        const chatContent = chatBox.querySelector('.chat-content p');
        chatContent.textContent = customerMessage;
        chatBox.classList.add('show');
        console.log('Chat box appeared');
    }, 800);
}