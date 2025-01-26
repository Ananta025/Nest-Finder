const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
async function connectDB(){
    await mongoose.connect(MONGO_URL);
}
connectDB().then(()=>{
    console.log("Connected to the database");
}).catch((err)=>{
    console.log("Error connecting to the database",err);
});


const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj , owner:'6793e0537f6f8ac5ea688084'}));
    initData.data = initData.data.map((obj)=>({...obj , geometry:{type:"Point", coordinates:[77.2088, 28.6139]}}));
    await Listing.insertMany(initData.data);
    console.log("Database initialized");
};
initDB();