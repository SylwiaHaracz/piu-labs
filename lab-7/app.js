import products from './data.json' with { type: 'json' };

import './components/productList.js';
import './components/Cart.js';

const productList = document.querySelector('product-list');
productList.products = products;
