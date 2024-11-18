const fs = require("fs");
const {mongoose,db} = require('../utils/mongooseModule') // adjust the path as necessary
const config = JSON.parse(fs.readFileSync('config/config.json'));

(async () => {
    const mongoUser = config.mongodb.username;
    const mongoPassword = config.mongodb.password;
    const mongoURI = `mongodb+srv://${mongoUser}:${mongoPassword}@cluster19885.jm6vp.mongodb.net/sample_restaurants?retryWrites=true&w=majority&appName=Cluster19885`;// replace with your MongoDB URI
    await db.initialize(mongoURI);

    try {
        // Example: Add a new restaurant
        await db.addNewRestaurant({
            restaurant_id: '1',
            name: 'Test Restaurant',
            address: {
                building: '10',
                street: 'Test Street',
                zipcode: '12345',
                coord: [40.7128, -74.0060]
            },
            borough: 'Test Borough',
            cuisine: 'Test Cuisine',
            grades: [{ date: new Date(), grade: 'A', score: 95 }]
        });

        // Example: Get all restaurants
        const allRestaurants = await db.getAllRestaurants(1, 10);
        console.log('All Restaurants:', allRestaurants);

        // Example: Get a restaurant by ID
        const restaurant = await db.getRestaurantById('1');
        console.log('Restaurant by ID:', restaurant);

        // Example: Update a restaurant by ID
        const updatedRestaurant = await db.updateRestaurantById('1', { name: 'Updated Restaurant' });
        console.log('Updated Restaurant:', updatedRestaurant);

        // Example: Delete a restaurant by ID
        const deletedRestaurant = await db.deleteRestaurantById('1');
        console.log('Deleted Restaurant:', deletedRestaurant);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0); // close the script
    }
})();
