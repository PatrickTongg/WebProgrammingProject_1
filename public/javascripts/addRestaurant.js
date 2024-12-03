document.getElementById('addRestaurantForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData(this);
    const formObject = Object.fromEntries(formData.entries());

    fetch(this.action, {
        method: this.method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObject)
    })
        .then(response => response.json())
        .then(data => {
            if(data.status !== 201) {
                console.log(data)
                document.querySelector('.error-container').innerHTML = data.message;
            }
            else{
                alert('Restaurant has been created');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            document.querySelector('.error-container').innerHTML = error.message;
        });
});
