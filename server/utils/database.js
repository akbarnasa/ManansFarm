import mongoose from "mongoose";

const connectDb = async()=> {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: "ECOMMERCE",
        });

        console.log("Connected");
    } catch (error) {
        console.log ("Not Connected:",error);
    }
}

export default connectDb;