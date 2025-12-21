import './productCard.js';

export default class ProductList extends HTMLElement {
    set products(value) {
        this._products = value;
        this.render();
    }

    render() {
        this.innerHTML = '';
        this._products.forEach((p) => {
            const card = document.createElement('product-card');
            card.product = p;
            this.appendChild(card);
        });
    }
}

customElements.define('product-list', ProductList);
