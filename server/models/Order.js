import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
      },  

      items: [{
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true }
      }],
      

method:{
    type: String,
    required: true,
},

paymentInfo:{
    type: String,
},

user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
},

namaDepan: {
    type: String,
    required: true,
  },
  namaBelakang: {
    type: String,
    required: true,
  },

phone: {
    type: Number,
    required: true,
},

kodePos: {
  type: String,
  required: true,
},

address: {
    alamatLengkap: { type: String, required: true },
    kecamatan: { type: String, required: true },
    kabupaten: { type: String, required: true },
    provinsi: { type: String, required: true },
  },
  
status: {
    type: String,
    default: "Sedang diproses",
},

paidAt: {
    type: Date,
},

subTotal: {
    type: Number,
    required: true,
},

createdAt: {
    type: Date,
    default: Date.now(),
},
},
{
  timestamps: true
}
);

export const Order =mongoose.model("Order", schema);