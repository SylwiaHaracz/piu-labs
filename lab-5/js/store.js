const STORAGE_KEY = 'shapes-app-v1';

class Store {
    constructor() {
        this.subscribers = [];

        const saved = localStorage.getItem(STORAGE_KEY);
        this.state = saved ? JSON.parse(saved) : { shapes: [] };
    }

    subscribe(fn) {
        this.subscribers.push(fn);
    }

    notify() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        this.subscribers.forEach((fn) => fn(this.state));
    }

    addShape(shape) {
        this.state.shapes.push(shape);
        this.notify();
    }

    removeShape(id) {
        this.state.shapes = this.state.shapes.filter((s) => s.id !== id);
        this.notify();
    }

    recolorByType(type, newColorFn) {
        this.state.shapes.forEach((s) => {
            if (s.type === type) s.color = newColorFn();
        });
        this.notify();
    }

    count(type) {
        return this.state.shapes.filter((s) => s.type === type).length;
    }
}

export const store = new Store();
