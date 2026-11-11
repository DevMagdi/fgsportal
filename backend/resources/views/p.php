<!DOCTYPE html>
<html>
<body>
 <?php
$to = 'ataha@alphaiota.com.sa';
$subject = 'Test email';
$message = 'This is a test email sent using Sendmail in PHP';
$headers = 'From: alphaiotapm@gmail.com' . "\r\n" .
    'Password:eixqislobynbvbwg'."\r\n" .
    'Reply-To: alphaiotapm@gmail.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

// Send the email using the mail() function with Sendmail
mail($to, $subject, $message, $headers);

?>

</body>
</html>
