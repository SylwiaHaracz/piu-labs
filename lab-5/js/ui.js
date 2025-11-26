import { store } from './store.js';
import { randomHsl } from './helpers.js';

const board = document.getElementById('board');
const cntSquares = document.getElementById('cntSquares');
const cntCircles = document.getElementById('cntCircles');

const domMap = new Map();

function render(state) {
    const idsInStore = new Set(state.shapes.map((s) => s.id));

    for (const [id, el] of domMap.entries()) {
        if (!idsInStore.has(id)) {
            el.remove();
            domMap.delete(id);
        }
    }

    state.shapes.forEach((shape) => {
        if (!domMap.has(shape.id)) {
            const el = document.createElement('div');
            el.className = `shape ${shape.type}`;
            el.dataset.id = shape.id;
            el.style.backgroundColor = shape.color;
            board.appendChild(el);
            domMap.set(shape.id, el);
        } else {
            const el = domMap.get(shape.id);
            el.style.backgroundColor = shape.color;
        }
    });

    cntSquares.textContent = store.count('square');
    cntCircles.textContent = store.count('circle');
}

store.subscribe(render);

board.addEventListener('click', (e) => {
    const id = e.target?.dataset?.id;
    if (!id) return;

    store.removeShape(id);
});

render(store.state);
