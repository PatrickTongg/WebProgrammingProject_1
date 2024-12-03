document.addEventListener('DOMContentLoaded', () => {
    const listRestaurantsButton = document.getElementById('listRestaurantsBtn');
    const addRestaurantButton = document.getElementById('addRestaurantBtn');
    const logoutButton = document.getElementById('logoutBtn');

    logoutButton.addEventListener('click', logout);
    addRestaurantButton.addEventListener('click',loadForm )
    listRestaurantsButton.addEventListener('click', fetchAndRenderRestaurants);
    async function fetchAndRenderRestaurants() {
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
                alert('Network response was not ok');
            }

            const restaurants = await response.text();
            renderRestaurants(restaurants);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
    }

    async function loadForm(restaurants) {
        try {
            const response = await fetch("/addRestaurant",
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
            if (!response.ok) {
                alert('Network response was not ok');
            }
            const form = await response.text();
            renderRestaurants(form);
        }catch (error) {
            console.error('Error fetching restaurants:', error);
            alert("Error fetching restaurants");
        }

    }

    async function logout() {
        try {
            localStorage.removeItem('token');
            window.alert('Logged out success');
            window.location.href = '/';

        }
        catch (error) {
            console.error('Error deleting restaurant:', error);
        }
    }
    function renderRestaurants(restaurants) {
        document.open()
        document.write(restaurants);
        document.close()
    }

});