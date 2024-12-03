document.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.getElementById('filterForm');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const deleteButtons = document.querySelectorAll('.delete-btn');

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

    deleteButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const restaurantId = button.getAttribute('data-id');

            if (confirm('Are you sure you want to delete this restaurant?')) {
                try {
                    const response = await fetch(`/api/restaurants/${restaurantId}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        alert('Restaurant deleted successfully!');
                        location.reload();
                    } else {
                        alert('Failed to delete restaurant.');
                    }
                } catch (error) {
                    console.error('Error deleting restaurant:', error);
                    alert('An error occurred.');
                }
            }
        });
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