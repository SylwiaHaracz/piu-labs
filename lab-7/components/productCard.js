export default class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.selectedColor = null;
        this.selectedSize = null;
        this._product = null;
    }

    set product(value) {
        this._product = value;
        this.render();
    }

    get product() {
        return this._product;
    }

    render() {
        if (!this._product) return;

        const { name, price, promo, images, sizes } = this._product;

        const firstColor = Object.keys(images)[0];
        const firstImage = images[firstColor];

        if (!this.selectedColor) this.selectedColor = firstColor;
        if (!this.selectedSize && sizes?.length) this.selectedSize = sizes[0];

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

        img {
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
          flex: 1;
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

        .colors span {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #ccc;
          box-sizing: border-box;
        }

        .colors span.active {
          border-color: #000;
        }

        .sizes button {
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid #ccc;
          background: #fff;
          cursor: pointer;
          font-size: 12px;
        }

        .sizes button.active {
          background: #000;
          color: #fff;
          border-color: #000;
        }

        button.add {
          margin-top: auto;
          border: none;
          padding: 14px;
          background: #000;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
        }

        button.add:hover {
          background: #333;
        }
      </style>

      <div class="card">
        <div class="image-wrapper">
          ${promo ? `<div class="promo">${promo}</div>` : ''}
          <img src="${firstImage}" alt="${name}">
        </div>

        <div class="content">
          <div class="name">${name}</div>
          <div class="price">${price.toFixed(2)} zł</div>

          <div class="colors">
            ${Object.keys(images)
                .map(
                    (color) =>
                        `<span data-color="${color}" style="background:${color}"></span>`
                )
                .join('')}
          </div>

          <div class="sizes">
            ${sizes
                ?.map(
                    (size) =>
                        `<button type="button" data-size="${size}">${size}</button>`
                )
                .join('')}
          </div>
        </div>

        <button class="add" type="button">Do koszyka</button>
      </div>
    `;

        this.setupInteractions(images);
    }

    setupInteractions(images) {
        const img = this.shadowRoot.querySelector('img');

        this.shadowRoot.querySelectorAll('.colors span').forEach((span) => {
            if (span.dataset.color === this.selectedColor) {
                span.classList.add('active');
            }

            span.addEventListener('click', () => {
                this.selectedColor = span.dataset.color;
                img.src = images[this.selectedColor];

                this.shadowRoot
                    .querySelectorAll('.colors span')
                    .forEach((s) => s.classList.remove('active'));
                span.classList.add('active');
            });
        });

        this.shadowRoot.querySelectorAll('.sizes button').forEach((btn) => {
            if (btn.dataset.size === this.selectedSize) {
                btn.classList.add('active');
            }

            btn.addEventListener('click', () => {
                this.selectedSize = btn.dataset.size;

                this.shadowRoot
                    .querySelectorAll('.sizes button')
                    .forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        this.shadowRoot.querySelector('.add').addEventListener('click', () => {
            const colors = Object.keys(this._product.images);
            const hasManyColors = colors.length > 1;

            let displayName = this._product.name;

            if (hasManyColors) {
                displayName += ` (${this.selectedColor}, ${this.selectedSize})`;
            } else {
                displayName += ` (${this.selectedSize})`;
            }

            this.dispatchEvent(
                new CustomEvent('add-to-cart', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        id: this._product.id,
                        name: displayName,
                        price: this._product.price,
                        color: this.selectedColor,
                        size: this.selectedSize,
                    },
                })
            );
        });
    }
}

customElements.define('product-card', ProductCard);
