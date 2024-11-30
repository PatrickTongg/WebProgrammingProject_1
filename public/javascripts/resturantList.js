// public/javascripts/restaurantList.js

document.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.getElementById('filterForm');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');

    let currentPage = 0;

    filterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        currentPage = 0;
        fetchRestaurants();
    });

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            fetchRestaurants();
        }
    });

    nextPageButton.addEventListener('click', () => {
        currentPage++;
        fetchRestaurants();
    });

    function fetchRestaurants() {
        const borough = document.getElementById('borough').value;
        const perPage = document.getElementById('perPage').value;

        fetch(`/api/restaurants?page=${currentPage}&perPage=${perPage}&borough=${borough}`)
            .then(response => response.json())
            .then(data => {
                // Render the restaurant data in the page
                // This part can be enhanced to dynamically update the DOM
            })
            .catch(error => console.error('Error fetching restaurants:', error));
    }
});