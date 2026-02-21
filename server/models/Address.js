import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    namaDepan:{
        type: String,
        required: true,
    },
    namaBelakang:{
        type: String,
        required: true,
    },
    address: {
        alamatLengkap: { type: String, required: true },
        kecamatan: { type: String, required: true },
        kabupaten: { type: String, required: true },
        provinsi: { type: String, required: true },
      },
      
    kodePos: {
        type: Number,
        required:true,
    },
    phone: {
        type: Number,
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

export const Address = mongoose.model("Address", addressSchema);