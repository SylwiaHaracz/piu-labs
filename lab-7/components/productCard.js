export default class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 300px;
          font-family: Arial, sans-serif;
        }

        .card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .image-wrapper {
          position: relative;
        }

        ::slotted(img) {
          width: 100%;
          height: 400px;
          object-fit: cover;
          display: block;
        }

        .promo {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #e60023;
          color: #fff;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 14px;
        }

        .content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .name {
          font-size: 18px;
          font-weight: 600;
        }

        .price {
          font-size: 16px;
        }

        .colors,
        .sizes {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .sizes ::slotted(*) {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        button {
          margin-top: auto;
          border: none;
          padding: 14px;
          background: #000;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
        }

        button:hover {
          background: #333;
        }

        .hidden {
          display: none;
        }
      </style>

      <div class="card">
        <div class="image-wrapper">
          <slot name="image"></slot>
          <div class="promo">
            <slot name="promo"></slot>
          </div>
        </div>

        <div class="content">
          <div class="name"><slot name="name"></slot></div>
          <div class="price"><slot name="price"></slot></div>
          <div class="colors"><slot name="colors"></slot></div>
          <div class="sizes"><slot name="sizes"></slot></div>
        </div>

        <button type="button">Do koszyka</button>
      </div>
    `;

        this._observeSlots();
        this._setupButton();
        this._setupColorRadios();
    }

    _observeSlots() {
        const setup = (slotName, selector) => {
            const slot = this.shadowRoot.querySelector(
                `slot[name="${slotName}"]`
            );
            const container = this.shadowRoot.querySelector(selector);
            if (!slot || !container) return;
            const toggle = () => {
                container.classList.toggle(
                    'hidden',
                    slot.assignedElements().length === 0
                );
            };
            slot.addEventListener('slotchange', toggle);
            toggle();
        };

        setup('promo', '.promo');
        setup('colors', '.colors');
        setup('sizes', '.sizes');
    }

    _setupButton() {
        this.shadowRoot
            .querySelector('button')
            .addEventListener('click', () => {
                this.dispatchEvent(
                    new CustomEvent('add-to-cart', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            name: this.querySelector('[slot="name"]')
                                ?.textContent,
                            price: this.querySelector('[slot="price"]')
                                ?.textContent,
                        },
                    })
                );
            });
    }

    _setupColorRadios() {
        const image = this.querySelector('[slot="image"]');
        const colorsSlot = this.querySelector('[slot="colors"]');
        if (!image || !colorsSlot) return;

        const colorSpans = Array.from(colorsSlot.querySelectorAll('span'));
        colorsSlot.innerHTML = '';

        const name = `color-${Math.random()}`;

        colorSpans.forEach((span, index) => {
            const colorUrl = span.dataset.image;
            const colorValue = span.style.background;

            const label = document.createElement('label');
            label.style.display = 'inline-block';
            label.style.width = '20px';
            label.style.height = '20px';
            label.style.borderRadius = '50%';
            label.style.background = colorValue;
            label.style.border = '2px solid #ccc';
            label.style.cursor = 'pointer';
            label.style.marginRight = '6px';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = name;
            radio.value = colorUrl;
            radio.style.display = 'none';
            if (index === 0) radio.checked = true;
            label.appendChild(radio);

            radio.addEventListener('change', () => {
                if (radio.checked) {
                    image.src = colorUrl;
                    Array.from(colorsSlot.querySelectorAll('label')).forEach(
                        (l) => (l.style.border = '2px solid #ccc')
                    );
                    label.style.border = '2px solid #000';
                }
            });

            if (index === 0) label.style.border = '2px solid #000';

            colorsSlot.appendChild(label);
        });
    }
}

customElements.define('product-card', ProductCard);
