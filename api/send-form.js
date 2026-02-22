const nodemailer = require("nodemailer");
const querystring = require("querystring");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  // Parse URL-encoded form body
  let body = "";
  await new Promise((resolve) => {
    req.on("data", (chunk) => (body += chunk));
    req.on("end", resolve);
  });
  const { first_name, last_name, email, phone, message } =
    querystring.parse(body);

  // Validate required fields
  if (!first_name || !last_name || !email) {
    return res.status(400).send("Required fields are missing.");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtpout.secureserver.net",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Eau Claire Guitar Academy <${process.env.EMAIL_USER}>`,
    to: "contact@eauclaireguitaracademy.com",
    replyTo: `${first_name} ${last_name} <${email}>`,
    subject: "New Lead from Eau Claire Guitar Academy Website",
    text:
      `New contact form submission:\n\n` +
      `Name: ${first_name} ${last_name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone || "Not provided"}\n\n` +
      `Message:\n${message || "No message"}\n`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.writeHead(302, { Location: "/thank-you.html" });
    res.end();
  } catch (error) {
    console.error("Email error:", error);
    res
      .status(500)
      .send(
        "Sorry, something went wrong. Please try again or contact us directly."
      );
  }
};
