const boards = {
    ToDo: document.querySelector('#ToDoBoard'),
    InProgress: document.querySelector('#InProgressBoard'),
    Done: document.querySelector('#DoneBoard'),
};

const counters = {
    ToDo: document.querySelector('#ToDoCounter'),
    InProgress: document.querySelector('#InProgressCounter'),
    Done: document.querySelector('#DoneCounter'),
};

const addButtons = {
    ToDo: document.querySelector('#add-ToDo'),
    InProgress: document.querySelector('#add-InProgress'),
    Done: document.querySelector('#add-Done'),
};

const colorButtons = {
    ToDo: document.querySelector('#color-change-ToDo'),
    InProgress: document.querySelector('#color-change-InProgress'),
    Done: document.querySelector('#color-change-Done'),
};

let state = JSON.parse(localStorage.getItem('kanbanState')) || {
    ToDo: [],
    InProgress: [],
    Done: [],
};

function randomHsl() {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 75%)`;
}

function saveState() {
    localStorage.setItem('kanbanState', JSON.stringify(state));
}

function updateCounters() {
    for (const key in counters) {
        counters[key].textContent = state[key].length;
    }
}

function createCard(obj, column) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = obj.id;
    card.dataset.column = column;
    card.style.backgroundColor = obj.color;

    const content = document.createElement('div');
    content.textContent = obj.title;
    content.contentEditable = 'true';
    content.addEventListener('input', () => {
        const cardState = state[column].find((c) => c.id === obj.id);
        cardState.title = content.textContent;
        saveState();
    });

    const controls = document.createElement('div');
    controls.className = 'controls';

    const delBtn = document.createElement('button');
    delBtn.textContent = '❌';
    delBtn.addEventListener('click', () => {
        state[column] = state[column].filter((c) => c.id !== obj.id);
        card.remove();
        updateCounters();
        saveState();
    });

    const colorBtn = document.createElement('button');
    colorBtn.textContent = '🎨';
    colorBtn.addEventListener('click', () => {
        const newColor = randomHsl();
        card.style.backgroundColor = newColor;
        const cardState = state[column].find((c) => c.id === obj.id);
        cardState.color = newColor;
        saveState();
    });

    if (column === 'ToDo') {
        const rightBtn = document.createElement('button');
        rightBtn.textContent = '➡';
        rightBtn.addEventListener('click', () =>
            moveCard(obj.id, column, 'right')
        );
        controls.append(rightBtn);
    } else if (column === 'InProgress') {
        const leftBtn = document.createElement('button');
        leftBtn.textContent = '⬅';
        leftBtn.addEventListener('click', () =>
            moveCard(obj.id, column, 'left')
        );
        const rightBtn = document.createElement('button');
        rightBtn.textContent = '➡';
        rightBtn.addEventListener('click', () =>
            moveCard(obj.id, column, 'right')
        );
        controls.append(leftBtn, rightBtn);
    } else if (column === 'Done') {
        const leftBtn = document.createElement('button');
        leftBtn.textContent = '⬅';
        leftBtn.addEventListener('click', () =>
            moveCard(obj.id, column, 'left')
        );
        controls.append(leftBtn);
    }

    controls.append(colorBtn, delBtn);
    card.append(content, controls);
    return card;
}

function moveCard(id, from, direction) {
    const columns = ['ToDo', 'InProgress', 'Done'];
    const idx = columns.indexOf(from);
    const newIdx = direction === 'left' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= columns.length) return;

    const to = columns[newIdx];
    const card = state[from].find((c) => c.id === id);
    if (!card) return;

    state[from] = state[from].filter((c) => c.id !== id);
    state[to].push(card);
    renderBoard(from);
    renderBoard(to);
    saveState();
    updateCounters();
}

function renderBoard(column) {
    const board = boards[column];
    board.innerHTML = '';
    state[column].forEach((cardData) => {
        board.appendChild(createCard(cardData, column));
    });
    updateCounters();
}
for (const col in colorButtons) {
    colorButtons[col].addEventListener('click', () => {
        for (const card of state[col]) {
            card.color = randomHsl();
        }
        renderBoard(col);
        saveState();
    });
}

for (const col in addButtons) {
    addButtons[col].addEventListener('click', () => {
        const newCard = {
            id: Date.now() + Math.random().toString(16).slice(2),
            title: 'Nowa karta',
            color: randomHsl(),
        };
        state[col].push(newCard);
        renderBoard(col);
        saveState();
    });
}

for (const col in boards) renderBoard(col);
updateCounters();
