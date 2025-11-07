const generateOtpEmail = (otp, type = "verify") => {
  const title = type === "reset" ? "Password Reset OTP" : "Verification OTP";

  return `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border-radius: 12px; background: #f9f9f9; border: 1px solid #e0e0e0;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img 
      src="https://drive.google.com/uc?export=view&id=1kpLDYNKOuArpTjCeAeFaX03iOTA5Z-q1"
      alt="Velto"
      width="100"
      height="100"
      style="display: inline-block; border-radius: 0; object-fit: contain; background: none; padding: 0; margin: 0;"
    />
  </div>
    </div>
    <h2 style="color: #1D4ED8; text-align: center; font-size: 24px;">${title}</h2>
    <p style="font-size: 16px; text-align: center; color: #333;">Use the OTP below to continue:</p>
    <div style="text-align: center; margin: 20px 0;">
      <span style="display: inline-block; padding: 15px 25px; font-size: 28px; font-weight: bold; color: #1D4ED8; background: #E0F2FE; border-radius: 8px; letter-spacing: 5px;">${otp}</span>
    </div>
    <p style="font-size: 14px; text-align: center; color: #555;">This OTP is valid for 5 minutes only.</p>
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
    <p style="font-size: 12px; text-align: center; color: #888;">If you did not request this, please ignore this email.</p>
    <p style="font-size: 12px; text-align: center; color: #888;">&copy; 2025 Velto Finance Tracker App</p>
  </div>
  `;
};

module.exports = { generateOtpEmail };
