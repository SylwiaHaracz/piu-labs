const DEFAULT_OPTIONS = {
    baseURL: 'https://jsonplaceholder.typicode.com',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    timeout: 10000,
};

class Ajax {
    constructor(options = {}) {
        this.options = {
            ...DEFAULT_OPTIONS,
            ...options,
            headers: {
                ...DEFAULT_OPTIONS.headers,
                ...(options.headers || {}),
            },
        };
    }

    async _request(url, fetchOptions, localOptions = {}) {
        const config = {
            ...this.options,
            ...localOptions,
            headers: {
                ...this.options.headers,
                ...(localOptions.headers || {}),
            },
        };

        const finalUrl = config.baseURL + url;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);

        try {
            const response = await fetch(finalUrl, {
                ...fetchOptions,
                headers: config.headers,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                let details;

                try {
                    const err = await response.json();
                    details =
                        err?.message ||
                        `Błąd HTTP ${response.status} ${
                            response.statusText || ''
                        }`;
                } catch {
                    details = `Błąd HTTP ${response.status} ${
                        response.statusText || ''
                    }`;
                }

                throw new Error(details);
            }

            if (response.status === 204) return null;

            try {
                return await response.json();
            } catch {
                throw new Error('Invalid JSON response');
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error(`Request timed out after ${config.timeout}ms`);
            }

            throw new Error(`Network error: ${error.message}`);
        }
    }

    get(url, options = {}) {
        return this._request(url, { method: 'GET' }, options);
    }

    post(url, data, options = {}) {
        return this._request(
            url,
            {
                method: 'POST',
                body: JSON.stringify(data),
            },
            options
        );
    }

    put(url, data, options = {}) {
        return this._request(
            url,
            {
                method: 'PUT',
                body: JSON.stringify(data),
            },
            options
        );
    }

    delete(url, options = {}) {
        return this._request(url, { method: 'DELETE' }, options);
    }
}

export default Ajax;
