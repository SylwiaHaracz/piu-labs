export default class Cart extends HTMLElement {
    constructor() {
        super();
        this.items = [];
    }

    connectedCallback() {
        this.render();
        document.addEventListener('add-to-cart', (e) => {
            this.items.push(e.detail);
            this.render();
        });
    }

    remove(index) {
        this.items.splice(index, 1);
        this.render();
    }

    render() {
        const sum = this.items.reduce((a, b) => a + b.price, 0);

        this.innerHTML = `
      <h2>Koszyk</h2>
      <ul>
        ${this.items
            .map(
                (i, idx) =>
                    `<li>
                ${i.name} – ${i.price.toFixed(2)} zł
                <button data-i="${idx}">🗑️</button>
              </li>`
            )
            .join('')}
      </ul>
      <strong>Suma: ${sum.toFixed(2)} zł</strong>
    `;

        this.querySelectorAll('button').forEach((b) => {
            b.onclick = () => this.remove(b.dataset.i);
        });
    }
}

customElements.define('shopping-cart', Cart);
