import nodemailer from 'nodemailer';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req) {
  try {
    const { name, email, items, total } = await req.json();

    if (!name || !email || !items) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const RECEIVER = process.env.ORDER_RECEIVER_EMAIL || SMTP_USER;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      return new Response(JSON.stringify({ error: 'SMTP not configured' }), { status: 500 });
    }

    // Save order to Firestore (status: pending)
    const pedidoRef = await addDoc(collection(db, 'pedidos'), {
      name,
      email,
      items: items || [],
      total: Number(total || 0),
      status: 'pending',
      createdAt: serverTimestamp()
    });

    // Build HTML body
    const itemsHtml = (items || []).map(it => {
      return `<tr><td style="padding:8px;border:1px solid #eee">${escapeHtml(it.nombre)}</td><td style="padding:8px;border:1px solid #eee;text-align:center">${escapeHtml(String(it.quantity || 1))}</td><td style="padding:8px;border:1px solid #eee;text-align:right">€${(Number(it.precio||0)*Number(it.quantity||1)).toFixed(2)}</td></tr>`;
    }).join('');

    const html = `
      <h2>Nuevo pedido - LaTelaDelGol</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <table style="border-collapse:collapse;width:100%;margin-top:16px">
        <thead>
          <tr><th style="padding:8px;border:1px solid #eee;text-align:left">Producto</th><th style="padding:8px;border:1px solid #eee">Cant.</th><th style="padding:8px;border:1px solid #eee;text-align:right">Subtotal</th></tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <p style="text-align:right;font-weight:bold;margin-top:12px">Total: €${Number(total||0).toFixed(2)}</p>
    `;

    // If SendGrid API key is present, use SendGrid (recommended)
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    if (SENDGRID_API_KEY) {
      const sender = process.env.SENDGRID_SENDER || process.env.SMTP_USER || RECEIVER;
      const payload = {
        personalizations: [{ to: [{ email: RECEIVER }] }],
        from: { email: sender },
        subject: `Nuevo pedido de ${name} - €${Number(total||0).toFixed(2)}`,
        content: [{ type: 'text/html', value: html }]
      };

      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        // Update Firestore with failed status
        await updateDoc(doc(db, 'pedidos', pedidoRef.id), { status: 'failed', sentAt: serverTimestamp() });
        const text = await res.text();
        return new Response(JSON.stringify({ error: 'SendGrid error', detail: text }), { status: 500 });
      }

      // Update Firestore with sent status
      await updateDoc(doc(db, 'pedidos', pedidoRef.id), { status: 'sent', sentAt: serverTimestamp() });
      return new Response(JSON.stringify({ ok: true, provider: 'sendgrid' }), { status: 200 });
    }

    // Fallback to Nodemailer
    // En producción deployada (Vercel/Railway), NODE_ENV=production y TLS será estricto
    // En desarrollo local, permite certificados autofirmados si está habilitado
    const isProduction = process.env.VERCEL || process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV === 'production';
    const allowSelfSigned = process.env.SMTP_ALLOW_SELF_SIGNED === 'true';
    
    const transporterOptions = {
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    };

    // Solo permite certificados autofirmados si NO estás en producción y está habilitado
    if (!isProduction && allowSelfSigned) {
      transporterOptions.tls = { rejectUnauthorized: false };
    }

    const transporter = nodemailer.createTransport(transporterOptions);

    const info = await transporter.sendMail({
      from: `${SMTP_USER}`,
      to: RECEIVER,
      subject: `Nuevo pedido de ${name} - €${Number(total||0).toFixed(2)}`,
      html
    });

    await updateDoc(doc(db, 'pedidos', pedidoRef.id), { status: 'sent', sentAt: serverTimestamp(), transportInfo: info });

    return new Response(JSON.stringify({ ok: true, provider: 'smtp', info }), { status: 200 });
  } catch (err) {
    console.error('send-order error', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 });
  }
}
