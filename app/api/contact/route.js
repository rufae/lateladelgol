import nodemailer from 'nodemailer';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('Contact form submission:', body);

    // Save contact to Firestore for records
    let contactRef = null;
    try {
      contactRef = await addDoc(collection(db, 'contactos'), {
        name: body.name || '',
        email: body.email || '',
        message: body.message || '',
        createdAt: serverTimestamp(),
        sent: false
      });
    } catch (err) {
      console.error('Error saving contact to Firestore', err);
      // continue — we still try to send email
    }

    const subject = `Nuevo mensaje de contacto: ${body.name || 'Sin nombre'}`;
    const html = `
      <h2>Nuevo mensaje desde la web</h2>
      <p><strong>Nombre:</strong> ${body.name || '-'}</p>
      <p><strong>Email:</strong> ${body.email || '-'}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${(body.message || '-').replace(/\n/g, '<br/>')}</p>
    `;

    // Prefer SendGrid if available (keeps compatibility), otherwise use SMTP/Nodemailer like send-order
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const TO_EMAIL = process.env.CONTACT_TO || process.env.TO_EMAIL || process.env.ORDER_RECEIVER_EMAIL || process.env.SMTP_USER || null;
    const FROM_EMAIL = process.env.CONTACT_FROM || process.env.FROM_EMAIL || process.env.SMTP_USER || 'no-reply@lateladelgol.com';

    if (SENDGRID_API_KEY && TO_EMAIL) {
      try {
        const payload = {
          personalizations: [{ to: [{ email: TO_EMAIL }], subject }],
          from: { email: FROM_EMAIL, name: 'LaTelaDelGol' },
          content: [{ type: 'text/html', value: html }]
        };

        const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: { Authorization: `Bearer ${SENDGRID_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.status === 202) {
          if (contactRef) await updateDoc(doc(db, 'contactos', contactRef.id), { sent: true, provider: 'sendgrid', sentAt: serverTimestamp() });
          return new Response(JSON.stringify({ ok: true, sent: true, provider: 'sendgrid' }), { status: 200 });
        }

        const text = await res.text();
        console.error('SendGrid error', res.status, text);
        // fallthrough to SMTP attempt
      } catch (err) {
        console.error('SendGrid send error', err);
        // fallthrough to SMTP
      }
    }

    // Fallback to SMTP via Nodemailer (same behavior as send-order route)
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      return new Response(JSON.stringify({ ok: true, sent: false, message: 'Recibido; correo no enviado porque SMTP no está configurado.' }), { status: 200 });
    }

    const isProduction = process.env.VERCEL || process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV === 'production';
    const allowSelfSigned = process.env.SMTP_ALLOW_SELF_SIGNED === 'true';

    const transporterOptions = {
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    };
    if (!isProduction && allowSelfSigned) transporterOptions.tls = { rejectUnauthorized: false };

    const transporter = nodemailer.createTransport(transporterOptions);

    try {
      const info = await transporter.sendMail({
        from: `${FROM_EMAIL}`,
        to: TO_EMAIL || SMTP_USER,
        subject,
        html
      });
      if (contactRef) await updateDoc(doc(db, 'contactos', contactRef.id), { sent: true, provider: 'smtp', sentAt: serverTimestamp(), transportInfo: info });
      return new Response(JSON.stringify({ ok: true, sent: true, provider: 'smtp', info }), { status: 200 });
    } catch (err) {
      console.error('Error sending contact email via SMTP', err);
      if (contactRef) await updateDoc(doc(db, 'contactos', contactRef.id), { sent: false, providerError: String(err) });
      return new Response(JSON.stringify({ ok: true, sent: false, message: 'Recibido pero fallo el envío por SMTP.' }), { status: 200 });
    }
  } catch (err) {
    console.error('Error in /api/contact', err);
    return new Response(JSON.stringify({ ok: false, error: 'Invalid payload' }), { status: 400 });
  }
}
