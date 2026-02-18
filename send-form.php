<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: index.html");
    exit;
}

$first_name = htmlspecialchars(trim($_POST["first_name"] ?? ""));
$last_name = htmlspecialchars(trim($_POST["last_name"] ?? ""));
$email = htmlspecialchars(trim($_POST["email"] ?? ""));
$phone = htmlspecialchars(trim($_POST["phone"] ?? ""));
$message = htmlspecialchars(trim($_POST["message"] ?? ""));

if (empty($first_name) || empty($last_name) || empty($email)) {
    http_response_code(400);
    echo "Required fields are missing.";
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo "Invalid email address.";
    exit;
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'localhost';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'noreply@nateagapi.com';
    $mail->Password   = 'YOUR_EMAIL_PASSWORD_HERE';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    $mail->setFrom('noreply@nateagapi.com', 'Eau Claire Guitar Academy');
    $mail->addAddress('jokerthief55@gmail.com');
    $mail->addReplyTo($email, "$first_name $last_name");

    $mail->Subject = 'New Lead from Eau Claire Guitar Academy Website';
    $mail->Body    = "New contact form submission:\n\n"
                   . "Name: $first_name $last_name\n"
                   . "Email: $email\n"
                   . "Phone: $phone\n\n"
                   . "Message:\n$message\n";

    $mail->send();
    header("Location: thank-you.html");
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo "Sorry, something went wrong. Please try again or contact us directly.";
}
