import { NextResponse, type NextRequest } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as File;
    const orderId = formData.get('orderId') as string;
    const customerName = formData.get('customerName') as string;
    const customerEmail = formData.get('customerEmail') as string;
    const productName = formData.get('productName') as string;
    const amountFormatted = formData.get('amountFormatted') as string;

    if (!pdfFile) {
      return NextResponse.json({ error: 'No PDF file uploaded' }, { status: 400 });
    }

    // Convert file to ArrayBuffer and then Buffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get SMTP configuration from environment variables
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || `"Aethangraey" <shinjansarkar268@gmail.com>`;

    // Destination email as requested by the user
    const to = 'shinjansarkar7@gmail.com';

    if (!host || !user || !pass) {
      return NextResponse.json(
        { error: 'SMTP configuration is incomplete in .env.local.' },
        { status: 500 }
      );
    }

    const transport = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const emailSubject = `Invoice INV-${orderId} from Aethangraey`;

    const emailHtmlBody = `
      <div style="margin:0;padding:0;background:#f6f3ee;font-family:Arial,sans-serif;color:#1a1916">
        <div style="max-width:600px;margin:0 auto;padding:32px 16px">
          <div style="background:#ffffff;border:1px solid #e8e2d9;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(20,18,14,.05)">
            <div style="padding:24px;background:linear-gradient(135deg,#1a1916 0%,#2b271f 100%);color:#ffffff">
              <div style="font-size:10px;letter-spacing:.25em;text-transform:uppercase;opacity:.8;margin-bottom:8px">AETH AN GRAEY</div>
              <h1 style="margin:0;font-size:24px;line-height:1.2;font-family:Georgia,serif">Invoice INV-${orderId}</h1>
            </div>
            <div style="padding:28px">
              <p style="font-size:15px;line-height:1.6;margin:0 0 16px;color:#2a2925">
                Hello ${customerName},
              </p>
              <p style="font-size:15px;line-height:1.6;margin:0 0 20px;color:#2a2925">
                Please find attached the official PDF invoice for your purchase with <strong>Aethangraey</strong>.
              </p>
              
              <table style="width:100%;border-collapse:collapse;margin:0 0 24px;font-size:14px">
                <tr style="border-bottom:1px solid #ebebeb">
                  <td style="padding:8px 0;color:#7a7570">Order ID</td>
                  <td style="padding:8px 0;text-align:right;font-weight:600;color:#1a1916">${orderId}</td>
                </tr>
                <tr style="border-bottom:1px solid #ebebeb">
                  <td style="padding:8px 0;color:#7a7570">Customer Name</td>
                  <td style="padding:8px 0;text-align:right;font-weight:600;color:#1a1916">${customerName}</td>
                </tr>
                <tr style="border-bottom:1px solid #ebebeb">
                  <td style="padding:8px 0;color:#7a7570">Customer Email</td>
                  <td style="padding:8px 0;text-align:right;font-weight:600;color:#1a1916">${customerEmail}</td>
                </tr>
                <tr style="border-bottom:1px solid #ebebeb">
                  <td style="padding:8px 0;color:#7a7570">Product Name</td>
                  <td style="padding:8px 0;text-align:right;font-weight:600;color:#1a1916">${productName}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#7a7570;font-weight:600">Total Amount</td>
                  <td style="padding:8px 0;text-align:right;font-weight:700;color:#a8925a">${amountFormatted}</td>
                </tr>
              </table>

              <div style="border-top:1px solid #e8e2d9;padding-top:16px;font-size:13px;color:#7a7570;line-height:1.5">
                If you have any questions about this invoice, please do not hesitate to contact us at contact@aethangraey.com.
              </div>
            </div>
            <div style="background:#f8f7f5;padding:16px;text-align:center;font-size:11px;color:#9a9590;border-top:1px solid #ebebeb">
              &copy; 2026 AETH AN GRAEY. Crafting luxury, one step at a time.
            </div>
          </div>
        </div>
      </div>
    `;

    // Send the email with PDF attachment
    await transport.sendMail({
      from,
      to,
      subject: emailSubject,
      html: emailHtmlBody,
      attachments: [
        {
          filename: pdfFile.name || `Invoice_${orderId}.pdf`,
          content: buffer,
          contentType: 'application/pdf',
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in send invoice API:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
