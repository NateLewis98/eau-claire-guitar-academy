const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse form data
app.use(express.urlencoded({ extended: false }));

// Serve static files (index.html, styles.css, logo.jpg, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Handle form submission
app.post("/send-form", async (req, res) => {
  const { first_name, last_name, email, phone, message } = req.body;

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
    to: process.env.EMAIL_TO || "jokerthief55@gmail.com",
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
    res.redirect("/thank-you.html");
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).send("Sorry, something went wrong. Please try again or contact us directly.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
