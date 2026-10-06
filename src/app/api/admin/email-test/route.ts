import { NextRequest, NextResponse } from "next/server";
import { getEmailConfig, getOrderNotificationRecipients } from "@/lib/email";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const config = await getEmailConfig();

    if (!config.isConfigured) {
      return NextResponse.json({
        success: false,
        error: "Identifiants SMTP manquants ! Veuillez renseigner l'adresse e-mail expéditrice (Gmail) et le mot de passe d'application dans les paramètres ou le fichier .env.",
      }, { status: 400 });
    }

    const recipients = await getOrderNotificationRecipients();
    if (!recipients || recipients.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Aucun destinataire n'est configuré dans la liste.",
      }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    // Verify SMTP connection first
    await transporter.verify();

    // Send test email
    await transporter.sendMail({
      from: `"Distribution Gandouz" <${config.user}>`,
      to: recipients.join(", "),
      subject: "✅ Test de notification e-mail - Distribution Gandouz",
      text: "Ceci est un e-mail de test confirmant que votre serveur SMTP est parfaitement configuré pour envoyer les alertes de commandes.",
      html: `
        <div style="font-family: sans-serif; max-width: 550px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background-color: #ffffff;">
          <h2 style="color: #06091F; margin-top: 0;">🎉 Configuration E-mail Réussie !</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            Ce message confirme que les notifications automatiques de commande fonctionnent correctement.
          </p>
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 12px 16px; margin: 16px 0; font-size: 13px; color: #334155;">
            <strong>Expéditeur :</strong> ${config.user}<br />
            <strong>Destinataires :</strong> ${recipients.join(", ")}<br />
            <strong>Date du test :</strong> ${new Date().toLocaleString("fr-FR")}
          </div>
          <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">
            Distribution Gandouz · Developed by MSDI Soft © 2026
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: `E-mail de test envoyé avec succès à : ${recipients.join(", ")}`,
    });
  } catch (error: any) {
    console.error("Test email error:", error);
    let errorMessage = error.message || "Erreur inconnue lors de l'envoi";

    if (errorMessage.includes("EAUTH") || errorMessage.includes("Invalid login") || errorMessage.includes("Username and Password not accepted")) {
      errorMessage = "Erreur d'authentification Gmail (535) : Veuillez vérifier votre adresse Gmail et générer un 'Mot de passe d'application' à 16 caractères (nécessite la validation en 2 étapes activée sur votre compte Google).";
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
    }, { status: 500 });
  }
}
