import { error } from "console";
import { createTransport } from "nodemailer";

const otpSending = async({email, subject, otp}) => {

    if (!email) {
        throw new Error ("Alamat email tidak boleh kosong.")
    }

    const transport = createTransport({
        host:"smtp.gmail.com",
        port: 465,
        auth:{
            user: process.env.Gmail,
            pass: process.env.Password
        }
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikasi Kode OTP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            color: black;
            font-size: 35px;
        }
        p {
            color: #666;
        }
        .otp {
            font-size: 25px;
            color: #7b68ee;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>MANAN'S FARM OFFICIAL</h1>
        <p>Hello ${email}, kode OTP untuk login anda:</p>
        <p class="otp">${otp}</p>
        <div style="color: gray;">Kode ini hanya sekali pakai dan akan kadaluarsa dalam 5 menit</div>
    </div>
</body>
</html>`;

    try {
        await transport.sendMail({
            from: process.env.Gmail,
            to: email, 
            subject,
            html,
        });
    } catch (err) {
        if (err.message.includes("error is not a constructor")) {
            throw new Error ("Alamat email belum diisi.")

        }
        throw err;
    }

};

export default otpSending;