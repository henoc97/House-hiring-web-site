

const fs = require('fs');
const nodemailer = require('nodemailer');
const qr = require('qrcode');
require('dotenv').config();

// Fonction pour générer le code QR
async function generateQRCode(data) {
    try {
        return await qr.toDataURL(data);
    } catch (error) {
        throw new Error('Erreur lors de la génération du code QR');
    }
}

// Fonction pour envoyer l'e-mail avec le code QR
async function sendEmail(receiverEmail, transferInfo) {
    // Générer le code QR avec les informations de transfert
    const qrData = await generateQRCode(JSON.stringify(transferInfo));

    // Charger le template HTML
    const emailTemplate = fs.readFileSync('email/transfer_qr/qr_email.html', 'utf8');

    // Configurer le transporteur de messagerie
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.APP_EMAIL, // Votre adresse e-mail
            pass: process.env.EMAIL_PASS // Votre mot de passe
        }
    });

    // Options de l'e-mail
    let mailOptions = {
        from: process.env.APP_EMAIL, // Votre adresse e-mail
        to: receiverEmail,
        subject: 'Notification de transfert via QuickTransfer',
        html: emailTemplate,
        attachments: [{
            filename: 'qrcode.png',
            content: qrData.split(';base64,').pop(),
            encoding: 'base64',
            cid: 'qrcode'
        }]
    };

    // Envoyer l'e-mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Erreur lors de l\'envoi de l\'e-mail :', error);
        } else {
            console.log('E-mail envoyé avec succès :', info.response);
        }
    });
}

module.exports = {sendEmail};
// // Exemple d'utilisation
// const receiverEmail = 'nononephew@gmail.com';
// const transferInfo = {
//     sender: "AMAVIGAN Henoc",
//     amount: 100, // Montant du transfert
//     date: new Date().toLocaleDateString() // Date du transfert
// };
// console.log(process.env.APP_EMAIL, process.env.EMAIL_PASS)
// // Envoyer l'e-mail
// sendEmail(receiverEmail, transferInfo);
