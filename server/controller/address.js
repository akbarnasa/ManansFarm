import { Address } from "../models/Address.js"
import TryCatch from "../utils/TryCatch.js";

export const addAddress = TryCatch(async(req, res) => {
    const {namaDepan,
        namaBelakang,
        phone,
        kodePos,
        address} = req.body

        const { alamatLengkap, kecamatan, kabupaten, provinsi } = address;

    await Address.create ({
        
        namaDepan,
        namaBelakang,
        address: {
            alamatLengkap,
            kecamatan,
            kabupaten,
            provinsi,
        },
        phone,
        kodePos,
        user: req.user._id,
    });

    res.status(201).json({
        message: "Alamat telah dibuat",
    });
});

export const getAllAddress = TryCatch(async (req,res) => {
    const allAddress = await Address.find({user: req.user._id});

    res.json(allAddress);
});

export const getSingleAddress = TryCatch(async(req,res)=> {
    const address = await Address.findById(req.params.id);

    res.json(address);
});

export const deleteAddress = TryCatch(async(req, res) => {
    const address = await Address.findOne({
        _id: req.params.id,
        user: req.user._id,
    });

    await address.deleteOne();

    res.json({
        message: "Alamat telah dihapus",
    });
});

