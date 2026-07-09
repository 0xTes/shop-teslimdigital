const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendOrderConfirmation = async (order, user) => {
  await transporter.sendMail({
    from: '"Teslim Digital" <orders@teslimdigital.com>',
    to: user.email,
    subject: `Order Confirmation #${order.orderNumber}`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Order #: ${order.orderNumber}</p>
      <p>Total: ₦${order.total}</p>
      <p>We'll send you shipping updates soon.</p>
    `
  });
};