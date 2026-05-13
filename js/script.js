// ZAP ZAAP - Game

const customerImages = [
    'images/customer-red.png',
    'images/customer-blue.png',
    'images/customer-yellow.png'
];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize game
    spawnCustomer();
});

function spawnCustomer() {
    // Select random customer
    const randomIndex = Math.floor(Math.random() * customerImages.length);
    const customerImage = customerImages[randomIndex];
    
    const customerElement = document.getElementById('customer');
    customerElement.style.backgroundImage = 'url(' + customerImage + ')';
    
    console.log('Customer spawned:', customerImage);
}