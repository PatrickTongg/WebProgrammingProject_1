const mongoose = require('mongoose');
const fs = require('fs');
const {Model} = require("mongoose");


const restaurantSchema = new mongoose.Schema({
    restaurant_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: {
        building: { type: String, required: true },
        street: { type: String, required: true },
        zipcode: { type: String, required: true },
        coord: { type: [Number], index: '2dsphere' }
    },
    borough: { type: String},
    cuisine: { type: String, required: true },
    grades: [
        {
            date: { type: Date},
            grade: { type: String},
            score: { type: Number}
        }
    ]
});

const Restaurant = mongoose.model('restaurants', restaurantSchema);


const db = {
    initialize : async (mongoURI) => {
        try {
            await mongoose.connect(mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("Connected to MongoDB successfully.");
        } catch (error) {
            console.error("MongoDB connection error:", error);
            process.exit(1);
        }
    },

    addNewRestaurant : async (restaurant) => {
        try {
            const newRestaurant = new Restaurant(restaurant);
            await newRestaurant.save();
            console.log("New restaurant added to MongoDB.");
        } catch (error) {
            console.error("Error adding new restaurant to MongoDB:", error);
        }
    },

    getAllRestaurants :async (page, perPage, borough) => {
        const query = borough ? {borough: borough} : {};
        return Restaurant.find(query).sort({restaurant_id: "ascending"})
            .skip((page - 1) * perPage).limit(perPage)},

    getRestaurantById : async (id) => {
        const restaurantData = Restaurant.findOne({restaurant_id: id});
        if (!restaurantData) {
            throw new Error('Restaurant not found');
        } else {
            return restaurantData
        }},

    updateRestaurantById : async (id, restaurant) => {
        const restaurantData = await Restaurant.findOneAndUpdate({restaurant_id: id}, restaurant, {new: true});
        if (!restaurantData) {
            throw new Error('Restaurant not found');
        } else {
            return restaurantData
        }
    },

    deleteRestaurantById : async (id) => {
        const restaurantData = await Restaurant.findOneAndDelete({restaurant_id: id});
        if (!restaurantData) {
            throw new Error('Restaurant not found');
        } else {
            return restaurantData
        }
    }
};

mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to MongoDB.");
});

mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from MongoDB.");
});


module.exports = {
    mongoose,
    db
};
