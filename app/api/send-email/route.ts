import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { to, subject, text } = await req.json();

    // Create a transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      text,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 