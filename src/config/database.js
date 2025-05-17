const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://amanshukla2295:F4dUC3mUrzzITJEs@namastedev.uuntsqg.mongodb.net/devTinder"
  );
};

module.exports = connectDB;


