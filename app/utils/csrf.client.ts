export function setupCSRFHeader() {
    const token = document.querySelector<HTMLInputElement>('input[name="csrf-token"]')?.value;
    
    if (token) {
        const originalFetch = window.fetch;
        window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
            if (init && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(init.method?.toUpperCase() || '')) {
                init.headers = {
                    ...init.headers,
                    'X-CSRF-Token': token,
                };
            }
            return originalFetch(input, init);
        };
    }
} 