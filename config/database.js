const mongoose = require('mongoose');

// Cấu hình kết nối với MongoDB
const connectDB = async () => {
    const conn = await mongoose.connect("mongodb+srv://KhanhPi:lonelystar1@khanhpi.0fpdm.mongodb.net/WebShop?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
}

module.exports = connectDB;