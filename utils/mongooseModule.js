const mongoose = require('mongoose');
const {Model} = require("mongoose");
const bcrypt = require('bcryptjs')
const exp = require("node:constants");



const restaurantSchema = new mongoose.Schema({
    restaurant_id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    address: {
        building: { type: String, required: true },
        street: { type: String, required: true },
        zipcode: { type: String, required: true },
        coord: { type: [Number], index: '2dsphere' }
    },
    borough: { type: String },
    cuisine: { type: String, required: true },
    grades: [
        {
            date: { type: Date },
            grade: { type: String },
            score: { type: Number }
        }
    ]
});

restaurantSchema.pre('save', async function (next) {
    if (this.isNew && !this.restaurant_id) { // Only for new documents without restaurant_id
        try {
            const counter = await Counter.findOneAndUpdate(
                { name: 'restaurant_id' },
                { $inc: { value: 1 } }, // Increment counter value
                { new: true } // Return the updated document
            );

            if (!counter) {
                throw new Error('Counter not found. Ensure it is initialized.');
            }

            this.restaurant_id = counter.value; // Assign the counter value to restaurant_id
            next();
        } catch (err) {
            console.error('Error in pre-save middleware:', err);
            next(err);
        }
    } else {
        next();
    }
});



const userSchema = new mongoose.Schema({
    username :{type: String, required: true,unique: true},
    password : {type: String, required: true},

});

const counterSchema = new mongoose.Schema({
    name: String, // Name of the counter
    value: Number, // Current counter value
});


const User = mongoose.model('users', userSchema);
const Restaurant = mongoose.model('restaurants', restaurantSchema);
const Counter = mongoose.model('Counter', counterSchema);

const userDb= {
    initialize : async (mongoURI) => {
        try {
            await mongoose.connect(mongoURI);
            console.log("Connected to MongoDB successfully.");
            }
            catch(err) {
            console.log("Error connecting to MongoDB server");
            console.log(err);
        }
    },
    addUser:async (user) => {
        try {
            const newUser = new User(user);
            await newUser.save();
            console.log("New user added to MongoDB.");
        } catch (error) {
            console.error("Error adding new user to MongoDB:", error);
            throw error;
        }
    },
    checkUser : async (user) => {
        const userData = await User.findOne({ username: user.username });
        if (!userData) {
            return false;
        }

        const isPasswordValid = await bcrypt.compare(user.password, userData.password);
        if (!isPasswordValid) {
            return false;
        }

        return userData;
    }
}

const db = {
    initialize : async (mongoURI) => {
        try {
            await mongoose.connect(mongoURI);
            console.log("Connected to MongoDB successfully.");
            const result = await Restaurant.aggregate([
                {
                    $group: {
                        _id: null,
                        maxId: { $max: "$restaurant_id" }
                    }
                }
            ]);
        } catch (error) {
            console.error("MongoDB connection error:", error);
            process.exit(1);
        }
    },
    addNewRestaurant: async (restaurant) => {
        try {
            restaurant.restaurant_id = await db.getNextSequence('restaurant_id');
            const newRestaurant = new Restaurant(restaurant);
            await newRestaurant.save();
            console.log("New restaurant added to MongoDB.");

        } catch (error) {
            console.error("Error adding new restaurant to MongoDB:", error);
            throw error;
        }
    },
    async getNextSequence(name) {
        const result = await Counter.findOneAndUpdate(
            { name },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );
        return result.value;
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
    db,
    userDb,
    User,
    Restaurant,
};
