const nodemailer = require('nodemailer');

const hasSmtpConfiguration = () => Boolean(
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
);

const getTransporter = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

const escapeHtml = (value) => String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const send = async (message) => {
  if (!hasSmtpConfiguration()) {
    return { skipped: true, reason: 'SMTP is not configured' };
  }
  return getTransporter().sendMail({
    from: process.env.EMAIL_FROM || '"Teslim Digital" <orders@teslimdigital.com>',
    ...message
  });
};

exports.sendOrderConfirmation = async (order, user) => send({
  to: user.email,
  subject: `Order Confirmation #${order.orderNumber}`,
  html: `
    <h1>Thank you for your order!</h1>
    <p>Order #: ${escapeHtml(order.orderNumber)}</p>
    <p>Total: NGN ${escapeHtml(order.total)}</p>
    <p>We'll send you shipping updates soon.</p>
  `
});

exports.sendShippingNotification = async (order, shipping) => send({
  to: order.email,
  subject: `Your Teslim Digital order ${order.orderNumber} is on its way`,
  html: `
    <h1>Your order has shipped</h1>
    <p>Order #: ${escapeHtml(order.orderNumber)}</p>
    <p>Carrier: ${escapeHtml(shipping.carrier || 'Teslim Digital')}</p>
    ${shipping.trackingNumber ? `<p>Tracking number: ${escapeHtml(shipping.trackingNumber)}</p>` : ''}
    ${shipping.trackingUrl ? `<p><a href="${escapeHtml(shipping.trackingUrl)}">Track your delivery</a></p>` : ''}
  `
});

exports.sendDeliveryNotification = async (order) => send({
  to: order.email,
  subject: `Your Teslim Digital order ${order.orderNumber} was delivered`,
  html: `<h1>Your order was delivered</h1><p>Order #: ${escapeHtml(order.orderNumber)}</p>`
});

exports.sendPasswordReset = async ({ email, firstName, resetUrl }) => send({
  to: email,
  subject: 'Reset your Teslim Digital password',
  html: `
    <h1>Password reset</h1>
    <p>Hello ${escapeHtml(firstName || '')},</p>
    <p><a href="${escapeHtml(resetUrl)}">Reset your password</a></p>
    <p>This link expires in one hour.</p>
  `
});
