import { createTransport } from "nodemailer";

const orderConfirmation = async({email, subject, orderId, products, totalAmount}) => {
    const transport = createTransport({
        host:"smtp.gmail.com",
        port: 465,
        auth:{
            user: process.env.Gmail,
            pass: process.env.Password
        }
    });

    const productsHtml = products
    .map(
      (product) => `
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">${product.name}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${product.quantity}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">Rp${product.price}</td>
            </tr>
        `
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f9f9f9;
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
            color: #4caf50;
        }
        p {
            color: #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .total {
            font-size: 18px;
            font-weight: bold;
            color: #000;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Konfirmasi Pesanan</h1>
        <p>Halo ${email},</p>
        <p>Pesananmu dengan (ID: <strong>${orderId}</strong>) telah diproses.</p>
        <table>
            <thead>
                <tr>
                    <th>Produk</th>
                    <th>Kuantitas</th>
                    <th>Harga</th>
                </tr>
            </thead>
            <tbody>
                ${productsHtml}
            </tbody>
        </table>
        <p class="total">Total Harga: Rp${totalAmount}</p>
        <p>Terimakasih telah berbelanja!</p>
    </div>
</body>
</html>`;

    await transport.sendMail({
        from: process.env.Gmail,
        to: email, 
        subject,
        html,
    });
};

export default orderConfirmation;