import express from "express";
import connectDb from "./utils/database.js";
import dotenv from 'dotenv'
import cloudinary from 'cloudinary'
import cors from 'cors'
import salesRoute from "./routes/salesRoute.js";


dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API_KEY, 
        api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();

app.use(express.json());
app.use(cors());
const port = process.env.PORT;


// routes import
import userRoutes from './routes/user.js'
import productRoutes from './routes/product.js'
import cartRoutes from './routes/cart.js'
import addressRoutes from './routes/address.js'
import orderRoutes from './routes/order.js'

// using routes
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);
app.use("/api", salesRoute);

app.listen(port, ()=> {
    console.log(`Server berjalan pada http://localhost:${port}`);
    connectDb();
});

