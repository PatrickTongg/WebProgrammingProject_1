document.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.getElementById('filterForm');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');

    let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;

    filterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        currentPage = 1
        localStorage.setItem('currentPage', currentPage);
        fetchRestaurants();
    });

    prevPageButton.addEventListener('click', () => {
        localStorage.getItem('currentPage', currentPage);
        if (currentPage > 1) {
            currentPage--;
            localStorage.setItem('currentPage', currentPage);
            fetchRestaurants();
        }
    });

    nextPageButton.addEventListener('click', () => {
        localStorage.getItem('currentPage', currentPage);
        currentPage++;
        localStorage.setItem('currentPage', currentPage);
        fetchRestaurants();
    });

    async function fetchRestaurants() {
        const borough = document.getElementById('borough').value || null;
        const perPage = document.getElementById('perPage').value || 10;

        try {
            const response = await fetch(`/api/restaurants?page=${currentPage}&perPage=${perPage}` + (borough ? `&borough=${borough}` : ''), {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.text();
            document.open();
            document.write(data);
            document.close();

        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
    }

});