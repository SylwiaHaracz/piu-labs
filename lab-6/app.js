import Ajax from './ajax-lib.js';

const api = new Ajax({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 4000,
});

const btnOK = document.getElementById('btn-ok');
const btnErr = document.getElementById('btn-error');
const btnReset = document.getElementById('btn-reset');
const loader = document.getElementById('loader');
const errorBox = document.getElementById('error');
const list = document.getElementById('list');

function showLoader(show) {
    loader.style.display = show ? 'block' : 'none';
}

function showError(msg) {
    errorBox.textContent = msg;
}

function clearAll() {
    list.innerHTML = '';
    errorBox.textContent = '';
}

btnOK.addEventListener('click', async () => {
    clearAll();
    showLoader(true);

    try {
        const posts = await api.get('/posts?_limit=5');

        await new Promise((resolve) => setTimeout(resolve, 2000));

        posts.forEach((p) => {
            const li = document.createElement('li');
            li.textContent = p.title;
            list.appendChild(li);
        });
    } catch (err) {
        showError(err.message);
    } finally {
        showLoader(false);
    }
});

btnErr.addEventListener('click', async () => {
    clearAll();
    showLoader(true);

    try {
        await api.get('/xyzxyzxyz');
    } catch (err) {
        showError(err.message);
    } finally {
        showLoader(false);
    }
});

btnReset.addEventListener('click', () => {
    clearAll();
});
