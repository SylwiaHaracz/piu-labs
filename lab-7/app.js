import './components/productCard.js';

document.addEventListener('add-to-cart', (e) => {
    console.log('Dodano do koszyka:', e.detail);
    alert(`Dodano do koszyka: ${e.detail.name}`);
});
