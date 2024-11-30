document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const errorContainer = document.querySelector('.error-container');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if (result.success) {
                localStorage.setItem('jwt', result.data.token);
            } else {
                errorContainer.innerHTML = `<p>${result.error}</p>`;
            }
        } catch (error){
            errorContainer.innerHTML = `<p>${error}</p>`;
        }
    });
});