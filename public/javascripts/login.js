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

                try {
                    const response = await fetch('/api/restaurants?page=1&perPage=10',
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            }
                        });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const html = await response.text();
                    document.open();
                    document.write(html);
                    document.close();
                } catch (error) {
                    console.error('Error fetching rendered HTML:', error);
                }
            } else {
                errorContainer.innerHTML = `<p>${result.error}</p>`;
            }
        } catch (error) {
            errorContainer.innerHTML = `<p>${error.message}</p>`;
        }
    });
});
