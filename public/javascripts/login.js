document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const errorContainer = document.querySelector('.error-container');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        errorContainer.innerHTML = '';

        if (!username || !password) {
            errorContainer.innerHTML = '<p>Username and password are required.</p>';
            return;
        }

        try {
            errorContainer.innerHTML = '<p>Logging in...</p>';

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Invalid username or password');
                } else if (response.status === 500) {
                    throw new Error('Internal server error. Please try again later.');
                } else {
                    throw new Error('Unexpected error occurred.');
                }
            }

            const result = await response.json();

            if (result.token) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('username', username);
                fetch('/api/restaurants', {
                    method: 'GET', 
                    headers: {
                        'Authorization': `Bearer ${result.token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                errorContainer.innerHTML = `<p>${result.error}</p>`;
            }
        } catch (error) {
            errorContainer.innerHTML = `<p>${error.message}</p>`;
        }
    });
});
