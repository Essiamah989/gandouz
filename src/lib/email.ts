import nodemailer from 'nodemailer';
import { getSettings } from './db';

const DEFAULT_RECIPIENTS = [
  "mahmoudiessia989@gmail.com",
  "mahmoudiessia@gmail.com"
];

export async function getOrderNotificationRecipients(): Promise<string[]> {
  try {
    const settings = await getSettings();
    if (settings && settings.order_notification_recipients) {
      const parsed = JSON.parse(settings.order_notification_recipients);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((e: string) => e.trim()).filter((e: string) => Boolean(e));
      }
    }
  } catch (error) {
    console.error("Error reading order notification recipients from settings:", error);
  }

  // Fallback to environment variable or defaults
  if (process.env.NOTIFICATION_EMAIL) {
    const envEmails = process.env.NOTIFICATION_EMAIL.split(',').map(e => e.trim()).filter(Boolean);
    const combined = Array.from(new Set([...DEFAULT_RECIPIENTS, ...envEmails]));
    return combined;
  }

  return DEFAULT_RECIPIENTS;
}

export async function getEmailConfig() {
  const settings = await getSettings();
  const host = settings.smtp_host || process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(settings.smtp_port || process.env.SMTP_PORT || '465');
  const user = settings.smtp_user || process.env.SMTP_USER || '';
  const pass = settings.smtp_pass || process.env.SMTP_PASS || '';
  return {
    host,
    port,
    user,
    pass,
    isConfigured: Boolean(user && pass),
  };
}

const getTransporter = async () => {
  const config = await getEmailConfig();
  return {
    transporter: nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: config.user ? {
        user: config.user,
        pass: config.pass,
      } : undefined,
    }),
    config,
  };
};

export const sendNewOrderEmail = async (order: any) => {
  const config = await getEmailConfig();
  if (!config.isConfigured) {
    console.warn("⚠️ [Email Notification] Missing SMTP credentials (smtp_user / smtp_pass). Please configure them in Admin Settings or .env.");
    return;
  }

  const recipients = await getOrderNotificationRecipients();

  if (!recipients || recipients.length === 0) {
    console.warn("No recipients configured for order notification, skipping email.");
    return;
  }

  const customerName =
    order.customerName ||
    order.shippingAddress?.customerName ||
    (order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() : "") ||
    "Client inconnu";

  const phone =
    order.phone ||
    order.shippingAddress?.phone ||
    order.user?.phone ||
    "Non renseigné";

  const email =
    order.email ||
    order.guestEmail ||
    order.user?.email ||
    "Non renseigné";

  const address =
    order.address ||
    order.shippingAddress?.address ||
    "Non renseignée";

  const city =
    order.city ||
    order.shippingAddress?.city ||
    "Non renseignée";

  const itemsListText = (order.items || []).map((item: any) => 
    `- ${item.productName || item.name} (x${item.qty || item.quantity || 1}) : ${Number(item.total || item.unitPrice || item.price || 0).toFixed(3)} TND`
  ).join('\n');

  const itemsListHtml = (order.items || []).map((item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #1e293b;">
        <strong>${item.productName || item.name}</strong>
        ${item.variantSize ? `<span style="color: #64748b; font-size: 12px;"> (${item.variantSize})</span>` : ''}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 14px; text-align: center; color: #1e293b;">
        ${item.qty || item.quantity || 1}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 14px; text-align: right; font-weight: bold; color: #0f172a;">
        ${Number(item.total || item.unitPrice || item.price || 0).toFixed(3)} TND
      </td>
    </tr>
  `).join('');

  const senderEmail = config.user || process.env.SMTP_USER || 'orders@gandouz.com';

  const mailOptions = {
    from: `"Distribution Gandouz" <${senderEmail}>`,
    to: recipients.join(', '),
    subject: `🔔 Nouvelle Commande #${order.orderNumber || 'Reçue'} - ${customerName}`,
    text: `
Nouvelle commande reçue sur Distribution Gandouz !

Numéro de commande: ${order.orderNumber || 'N/A'}
Client: ${customerName}
Téléphone: ${phone}
Email: ${email}
Adresse de livraison: ${address}, ${city}
Note: ${order.notes || 'Aucune'}

Articles:
${itemsListText}

Sous-total: ${Number(order.subtotal || 0).toFixed(3)} TND
Frais de livraison: ${Number(order.shipping || 0).toFixed(3)} TND
Total TTC: ${Number(order.total || 0).toFixed(3)} TND

Horaires de livraison: 10h00 - 21h00
    `,
    html: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background-color: #06091F; padding: 24px; text-align: center; border-bottom: 3px solid #F5D800;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">DISTRIBUTION GANDOUZ</h1>
        <p style="color: #F5D800; margin: 6px 0 0 0; font-size: 13px; font-weight: bold; text-transform: uppercase;">Nouvelle Commande Reçue</p>
      </div>

      <div style="padding: 24px;">
        <div style="background-color: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 20px; border-left: 4px solid #F5D800;">
          <h2 style="margin: 0 0 8px 0; font-size: 18px; color: #06091F;">Commande #${order.orderNumber}</h2>
          <p style="margin: 0; color: #64748b; font-size: 13px;">Date: ${new Date().toLocaleString('fr-FR')}</p>
        </div>

        <h3 style="color: #06091F; font-size: 15px; margin-bottom: 12px; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px;">Coordonnées Client & Livraison</h3>
        <table style="width: 100%; font-size: 13px; margin-bottom: 20px; line-height: 1.6;">
          <tr>
            <td style="color: #64748b; width: 35%;">Client:</td>
            <td style="color: #0f172a; font-weight: bold;">${customerName}</td>
          </tr>
          <tr>
            <td style="color: #64748b;">Téléphone:</td>
            <td style="color: #0f172a; font-weight: bold;"><a href="tel:${phone}" style="color: #1c2e5e; text-decoration: none;">${phone}</a></td>
          </tr>
          <tr>
            <td style="color: #64748b;">Email:</td>
            <td style="color: #0f172a;">${email}</td>
          </tr>
          <tr>
            <td style="color: #64748b;">Adresse:</td>
            <td style="color: #0f172a;">${address}, ${city}</td>
          </tr>
          ${order.notes ? `
          <tr>
            <td style="color: #64748b;">Notes:</td>
            <td style="color: #d97706; font-style: italic;">"${order.notes}"</td>
          </tr>
          ` : ''}
          <tr>
            <td style="color: #64748b;">Horaires livraison:</td>
            <td style="color: #059669; font-weight: bold;">10h00 - 21h00</td>
          </tr>
        </table>

        <h3 style="color: #06091F; font-size: 15px; margin-bottom: 12px; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px;">Articles Commandés</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f8fafc;">
              <th style="padding: 8px 10px; text-align: left; font-size: 12px; color: #475569; text-transform: uppercase;">Article</th>
              <th style="padding: 8px 10px; text-align: center; font-size: 12px; color: #475569; text-transform: uppercase;">Qté</th>
              <th style="padding: 8px 10px; text-align: right; font-size: 12px; color: #475569; text-transform: uppercase;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsListHtml}
          </tbody>
        </table>

        <div style="background-color: #f8fafc; border-radius: 12px; padding: 16px; margin-top: 10px;">
          <table style="width: 100%; font-size: 13px; line-height: 1.8;">
            <tr>
              <td style="color: #64748b;">Sous-total:</td>
              <td style="text-align: right; color: #0f172a; font-weight: bold;">${Number(order.subtotal || 0).toFixed(3)} TND</td>
            </tr>
            ${order.discount ? `
            <tr>
              <td style="color: #059669;">Remise:</td>
              <td style="text-align: right; color: #059669; font-weight: bold;">-${Number(order.discount).toFixed(3)} TND</td>
            </tr>` : ''}
            <tr>
              <td style="color: #64748b;">Frais de livraison:</td>
              <td style="text-align: right; color: #0f172a; font-weight: bold;">${Number(order.shipping || 0) === 0 ? 'Gratuite' : `${Number(order.shipping).toFixed(3)} TND`}</td>
            </tr>
            <tr style="border-top: 2px solid #e2e8f0; font-size: 16px;">
              <td style="color: #06091F; font-weight: bold; padding-top: 8px;">TOTAL TTC:</td>
              <td style="text-align: right; color: #06091F; font-weight: 900; padding-top: 8px;">${Number(order.total || 0).toFixed(3)} TND</td>
            </tr>
          </table>
        </div>
      </div>

      <div style="background-color: #06091F; padding: 16px; text-align: center; color: rgba(255,255,255,0.6); font-size: 12px;">
        <p style="margin: 0;">Distribution Gandouz · Système automatique de notifications</p>
        <p style="margin: 4px 0 0 0; font-size: 11px; color: rgba(255,255,255,0.4);">Developed by MSDI Soft © 2026</p>
      </div>
    </div>
    `
  };

  try {
    const { transporter } = await getTransporter();
    await transporter.sendMail(mailOptions);
    console.log(`Order notification email sent successfully to [${recipients.join(', ')}] for order #${order.orderNumber}`);
  } catch (error) {
    console.error("Error sending order notification email:", error);
  }
};
