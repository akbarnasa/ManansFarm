import { OTP } from "../models/otp.js";
import { User } from "../models/user.js";
import TryCatch from "../utils/TryCatch.js";
import otpSending from "../utils/otpSending.js";
import jwt from "jsonwebtoken";


export const loginUser = TryCatch(async(req,res)=> {
    const {email} = req.body;
   const subject = "Manans Farm 2025"

   const otp = Math.floor(Math.random() * 1000000);
   const prevOtp = await OTP.findOne({
    email,
   });
   if (prevOtp){
    await prevOtp.deleteOne();
   }

   await otpSending({email, subject, otp});
   await OTP.create({email, otp});
   res.json({
    message: "Kode OTP telah dikirim ke email anda",
   });
});

export const verifyUser = TryCatch (async (req, res) => {
    const {email, otp} = req.body;

    const haveOtp = await OTP.findOne({
        email,
        otp,
    });

    if (!haveOtp)
    return res.status(400).json({
message: "Kode OTP salah",
});

let user = await User.findOne({email})

if (user) {
    const token = jwt.sign({_id: user._id}, process.env.JWT_SEC, {
        expiresIn: "20d",
    });

    await haveOtp.deleteOne();

    res.json({
        message: "Anda telah masuk",
        token,
        user,
    });

} else {
    user = await User.create({
        email,
        name: "Pengguna Baru",
        role: "user", 
    });

    const token = jwt.sign({ _id: user._id}, process.env.JWT_SEC, {
        expiresIn: "20d",
    });

    await haveOtp.deleteOne();
    res.json({
        message: "Anda telah masuk",
        token,
        user,
    });
}
});

export const myProfile = TryCatch(async(req, res) => {
    console.log("Data pengguna dalam request:", req.user);
    const user =await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    res.json(user);
});

export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Gagal mengambil data pengguna" });
    }
  };

  export const deleteUserController = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Pengguna tidak ditemukan" });
  
    await user.deleteOne();
    res.status(200).json({ message: "Pengguna berhasil dihapus" });
  };
  