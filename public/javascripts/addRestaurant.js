document.getElementById('addRestaurantForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData(this);
    const formObject = Object.fromEntries(formData.entries());

    const requestBody = {
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

    const isCreate = this.method.toUpperCase() === 'POST';
    const url = this.action;
    const method = isCreate ? 'POST' : 'PUT';

    fetch(url, {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Request failed');
                });
            }
            return response.json();
        })
        .then(data => {
            if (isCreate) {
                alert('Restaurant Created Successfully.');
            } else {
                alert('Restaurant Updated Successfully.');
            }
            window.location.href = '/api/restaurants';
        })
        .catch(error => {
            console.error('Error:', error);
            document.querySelector('.error-container').innerHTML = error.message;
        });
});
