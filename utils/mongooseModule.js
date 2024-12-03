const mongoose = require('mongoose');
const {Model} = require("mongoose");
const bcrypt = require('bcryptjs')



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


const userSchema = new mongoose.Schema({
    username :{type: String, required: true,unique: true},
    password : {type: String, required: true},

});

const User = mongoose.model('users', userSchema);
const Restaurant = mongoose.model('restaurants', restaurantSchema);

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


            const maxRestaurantId = result.length > 0 ? result[0].maxId : "0";
            restaurant.restaurant_id = parseInt(maxRestaurantId) + 1;
            const newRestaurant = new Restaurant(restaurant);
            await newRestaurant.save();
            console.log("New restaurant added to MongoDB.");

        } catch (error) {
            console.error("Error adding new restaurant to MongoDB:", error);
            throw error;
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
    db,
    userDb,
    User,
    Restaurant,
};
