document.getElementById('addRestaurantForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData(this);
    const formObject = Object.fromEntries(formData.entries());

    const requestBody = {
        restaurant_id: formObject.restaurant_id.toString(), // Convert to string
        name: formObject.name,
        cuisine: formObject.cuisine,
        borough: formObject.borough || null,
        address: {
            building: formObject.building,
            street: formObject.street,
            zipcode: formObject.zipcode,
        },
        grades: formObject.gradeDate || formObject.grade || formObject.score
            ? [{
                date: formObject.gradeDate || null,
                grade: formObject.grade || null,
                score: formObject.score ? parseInt(formObject.score, 10) : null
            }]
            : []
    };

    fetch(this.action, {
        method: this.method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => response.json())
        .then(data => {
            if (data.status !== 201) {
                console.log(data);
                document.querySelector('.error-container').innerHTML = data.message;
            } else {
                document.querySelector('.error-container').innerHTML = 'Restaurant Created';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            document.querySelector('.error-container').innerHTML = error.message;
        });
});
