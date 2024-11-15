const mongoose = require('mongoose');
const fs = require('fs');

// Load configuration from config.json
const config = JSON.parse(fs.readFileSync('config.json'));

// MongoDB connection URI
const mongoURI = config.mongodb.uri;

// Connect to MongoDB
const connectToMongoDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB successfully.");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);  // Exit the application if connection fails
    }
};

// Monitor the connection
mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to MongoDB.");
});

mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from MongoDB.");
});

// Export the connect function for use in other modules
module.exports = {
    connectToMongoDB,
    mongoose,
};
