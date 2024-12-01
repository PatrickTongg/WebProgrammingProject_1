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
        const borough = document.getElementById('borough').value||1;
        const perPage = document.getElementById('perPage').value||10;

        fetch(`/api/restaurants?page=${currentPage}&perPage=${perPage}&borough=${borough}`)
            .catch(error => console.error('Error fetching restaurants:', error));
    }

});