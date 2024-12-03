document.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.getElementById('filterForm');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');

    let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;

    filterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        currentPage = 1
        localStorage.setItem('currentPage', currentPage);
        const boroughInput = document.getElementById('borough');
        if (isOnlySpaces(boroughInput.value)) {
            boroughInput.value = null;
        }
        fetchRestaurants(currentPage);
    });

    prevPageButton.addEventListener('click', () => {
        localStorage.getItem('currentPage', currentPage);
        if (currentPage > 1) {
            currentPage--;
            localStorage.setItem('currentPage', currentPage);
            fetchRestaurants(currentPage);
        }
    });

    nextPageButton.addEventListener('click', () => {
        localStorage.getItem('currentPage', currentPage);
        currentPage++;
        localStorage.setItem('currentPage', currentPage);
        fetchRestaurants(currentPage);
    });

    async function fetchRestaurants(page) {
        const borough = document.getElementById('borough').value || null;
        const perPage = document.getElementById('perPage').value || 10;
        window.location.href = `/api/restaurants?page=${page}&perPage=${perPage}` + (borough ? `&borough=${borough}` : '');
    }
    function isOnlySpaces(value) {
        return value.trim().length === 0;
    }

});