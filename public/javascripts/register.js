document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const errorContainer = document.querySelector('.error-container');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const renter_password = document.getElementById('renter-password').value;
        try {
            if (password !== renter_password){
                errorContainer.innerHTML = "Both Passwords do not match";
                form.reset();
                return;
            }
            const response = await fetch('/api/register', {
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