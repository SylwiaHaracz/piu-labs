import './ui.js';

import { store } from './store.js';
import { randomHsl, uid } from './helpers.js';

document.getElementById('addSquare').onclick = () => {
    store.addShape({
        id: uid(),
        type: 'square',
        color: randomHsl(),
    });
};

document.getElementById('addCircle').onclick = () => {
    store.addShape({
        id: uid(),
        type: 'circle',
        color: randomHsl(),
    });
};

document.getElementById('recolorSquares').onclick = () =>
    store.recolorByType('square', randomHsl);

document.getElementById('recolorCircles').onclick = () =>
    store.recolorByType('circle', randomHsl);
