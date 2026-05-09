import { connect } from 'cloudflare:sockets';

async function readResponse(reader) {
  const { value } = await reader.read();
  return new TextDecoder().decode(value);
}

async function sendCommand(writer, reader, command) {
  await writer.write(new TextEncoder().encode(command + '\r\n'));
  return await readResponse(reader);
}

async function sendEmail({ to, from, replyTo, subject, body, user, pass }) {
  const socket = connect('smtp.gmail.com:465', { secureTransport: 'on' });
  const writer = socket.writable.getWriter();
  const reader = socket.readable.getReader();

  try {
    await readResponse(reader);

    await sendCommand(writer, reader, 'EHLO cloudflare');

    await sendCommand(writer, reader, 'AUTH LOGIN');
    await sendCommand(writer, reader, btoa(user));
    const authResponse = await sendCommand(writer, reader, btoa(pass));

    if (!authResponse.startsWith('235')) {
      throw new Error('Authentication failed');
    }

    await sendCommand(writer, reader, `MAIL FROM:<${from}>`);
    await sendCommand(writer, reader, `RCPT TO:<${to}>`);
    await sendCommand(writer, reader, 'DATA');

    const message = [
      `From: "4B Overhead Doors Website" <${from}>`,
      `To: ${to}`,
      `Reply-To: ${replyTo}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/plain; charset=utf-8`,
      '',
      body,
      '.',
    ].join('\r\n');

    const dataResponse = await sendCommand(writer, reader, message);

    await sendCommand(writer, reader, 'QUIT');

    return dataResponse.startsWith('250');
  } finally {
    try {
      writer.releaseLock();
      reader.releaseLock();
      socket.close();
    } catch {}
  }
}

const SERVICE_LABELS = {
  residential: 'Residential Doors',
  commercial: 'Commercial Doors',
  repair: 'Repairs & Maintenance',
  other: 'Other',
};

export async function onRequestPost(context) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const { name, email, phone, service, message, honey } = await context.request.json();

    if (honey) {
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    if (!name || !email || !phone || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, phone, and message are required.' }),
        { status: 400, headers }
      );
    }

    const gmailUser = context.env.GMAIL_USER;
    const gmailPass = (context.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
    const toEmail = context.env.TO_EMAIL || gmailUser;

    if (!gmailUser || !gmailPass) {
      return new Response(
        JSON.stringify({ error: 'Email service is not configured.' }),
        { status: 500, headers }
      );
    }

    const serviceLabel = SERVICE_LABELS[service] || service || 'Not specified';
    const emailSubject = `New 4B Overhead Doors inquiry — ${name}`;
    const emailBody = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Service: ${serviceLabel}`,
      '',
      'Message:',
      message,
    ].join('\n');

    const success = await sendEmail({
      to: toEmail,
      from: gmailUser,
      replyTo: email,
      subject: emailSubject,
      body: emailBody,
      user: gmailUser,
      pass: gmailPass,
    });

    if (success) {
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    return new Response(
      JSON.stringify({ error: 'Failed to send email.' }),
      { status: 500, headers }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to send email.' }),
      { status: 500, headers }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
