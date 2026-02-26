const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const sendBookingConfirmation = async (bookingData) => {
    // Re-initialize transporter inside to ensure fresh env variables
    const port = parseInt(process.env.SMTP_PORT || '465');
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: port,
        secure: port === 465, // Use number comparison for safety
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    try {
        if (!process.env.SMTP_PASS || process.env.SMTP_PASS.includes('your_email_password')) {
            console.warn('SMTP Password is missing or not configured. Skipping email.');
            return { success: false, error: 'SMTP not configured' };
        }

        // Sanitize and trim all inputs (ensuring they are strings)
        const experience = String(bookingData.experience || '').trim();
        const date = String(bookingData.date || '').trim();
        const timeSlot = String(bookingData.timeSlot || '').trim();
        const guestName = (bookingData.guestName || '').trim();
        const guestEmail = (bookingData.guestEmail || '').trim();
        const participants = bookingData.participants;

        console.log(`Attempting to send confirmation email to ${guestEmail} via SMTP...`);

        const subtotal = Number(bookingData.price || 0);
        const tax = subtotal * 0.055;
        const total = subtotal + tax;

        const mailOptions = {
            from: `"PowerPlay Arena" <${process.env.SMTP_USER}>`,
            to: guestEmail,
            bcc: process.env.SMTP_USER, // BCC the admin so they have a record
            replyTo: process.env.SMTP_USER, // Allow guests to reply to the admin
            subject: `🎮 Booking Confirmed: ${bookingData.selectedGames && bookingData.selectedGames.length > 0 ? bookingData.selectedGames.join(', ') : experience}`,
            html: `
                <div style="background-color: #050505; color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #1a1a1a; border-radius: 16px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #00ecff; margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase;">PowerPlay Arena</h1>
                        <p style="color: #666; font-size: 14px; margin-top: 5px;">Two Worlds. One Arena.</p>
                    </div>

                    <div style="background: linear-gradient(135deg, #111 0%, #050505 100%); padding: 30px; border: 1px solid #222; border-radius: 12px; margin-bottom: 30px;">
                        <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">Booking Confirmed!</h2>
                        <p style="color: #ccc; line-height: 1.6;">Hi <strong>${guestName}</strong>,</p>
                        <p style="color: #ccc; line-height: 1.6;">Your mission is locked in. We've reserved your spot for an epic experience at PowerPlay Arena.</p>
                        
                        <div style="margin: 30px 0; border-left: 4px solid #00ecff; padding-left: 20px;">
                            <p style="margin: 10px 0;"><span style="color: #666; font-size: 12px; text-transform: uppercase; display: block;">Experience</span> <span style="font-size: 18px; color: #fff;">${experience}</span></p>
                            ${bookingData.selectedGames && bookingData.selectedGames.length > 0 ? `
                            <p style="margin: 10px 0;"><span style="color: #666; font-size: 12px; text-transform: uppercase; display: block;">Selected Game</span> <span style="font-size: 18px; color: #fff;">${bookingData.selectedGames.join(', ')}</span></p>
                            ` : ''}
                            <p style="margin: 10px 0;"><span style="color: #666; font-size: 12px; text-transform: uppercase; display: block;">Date</span> <span style="font-size: 18px; color: #fff;">${date}</span></p>
                            <p style="margin: 10px 0;"><span style="color: #666; font-size: 12px; text-transform: uppercase; display: block;">Time Arrival</span> <span style="font-size: 18px; color: #fff;">${timeSlot}</span></p>
                            <p style="margin: 10px 0;"><span style="color: #666; font-size: 12px; text-transform: uppercase; display: block;">Participants</span> <span style="font-size: 18px; color: #fff;">${participants} ${participants === 1 ? 'Person' : 'People'}</span></p>
                        </div>

                        <div style="margin-top: 20px; border-top: 1px solid #333; pt-20px;">
                            <table style="width: 100%; color: #ccc; font-size: 14px;">
                                <tr>
                                    <td style="padding: 5px 0;">Subtotal</td>
                                    <td style="text-align: right; padding: 5px 0;">$${subtotal.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0;">Tax</td>
                                    <td style="text-align: right; padding: 5px 0;">$${tax.toFixed(2)}</td>
                                </tr>
                                <tr style="font-weight: bold; color: #00ecff; font-size: 18px;">
                                    <td style="padding: 10px 0;">Total Paid</td>
                                    <td style="text-align: right; padding: 10px 0;">$${total.toFixed(2)}</td>
                                </tr>
                            </table>
                        </div>
                    </div>

                    <div style="text-align: center; color: #666; font-size: 13px; line-height: 1.6;">
                        <p>Questions? Just reply to this email or visit our site.</p>
                    </div>
                    
                    <div style="margin-top: 40px; border-top: 1px solid #1a1a1a; padding-top: 20px; text-align: center;">
                        <p style="color: #333; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
                            &copy; 2025 PowerPlay Arena. All rights reserved.
                        </p>
                    </div>
                </div>
            `
        };

        console.log(`[SMTP] Sending email: To=${guestEmail}, BCC=${process.env.SMTP_USER}, Subject=${mailOptions.subject}`);
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully via SMTP!');
        console.log('Server Response:', info.response);
        console.log('Message ID:', info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (err) {
        console.error('Failed to send email via SMTP:', err);
        return { success: false, error: err.message };
    }
};

module.exports = { sendBookingConfirmation };
