<?php
require $_SERVER['DOCUMENT_ROOT'] . '/../vendor/autoload.php';
date_default_timezone_set('Europe/Kiev');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

    // check that the request was sent using the POST method
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Некоректний метод запиту.']);
    exit;
}

    // get data from POST
$name = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name'])) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$start_date = isset($_POST['start_date']) ? htmlspecialchars(trim($_POST['start_date'])) : '';
$finish_date = isset($_POST['finish_date']) ? htmlspecialchars(trim($_POST['finish_date'])) : '';
$country = isset($_POST['country']) ? htmlspecialchars(trim($_POST['country'])) : '';
$city = isset($_POST['city']) ? htmlspecialchars(trim($_POST['city'])) : '';
$people_num = isset($_POST['people_num']) ? htmlspecialchars(trim($_POST['people_num'])) : '';
$info = isset($_POST['info_area']) ? htmlspecialchars(trim($_POST['info_area'])) : '';

    // check required input
if (empty($name) || empty($email) || empty($start_date) || empty($country)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Будь-ласка, заповніть обов\'язкові поля: Ім\'я, email, Дата, Країна.']);
    exit;
}

    // additional email validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Невірний формат електронної пошти.']);
    exit;
}

$to_email = 'mia@miatour.com.ua';
$currentDateTime = date('d.m.Y H:i');
$subject = '('. $currentDateTime .')';

$message_body = '<html><body>';
$message_body .= '<h2>Ви отримали новий запит на подорож:</h2>';
$message_body .= '<ul>';
$message_body .= '<li><strong>Ім\'я:</strong> ' . $name . '</li>';
$message_body .= '<li><strong>Email:</strong> ' . $email . '</li>';
$message_body .= '<li><strong>Країна:</strong> ' . ($country ?: 'Не вказано') . '</li>';
$message_body .= '<li><strong>Місто:</strong> ' . ($city ?: 'Не вказано') . '</li>';
$message_body .= '<li><strong>Дата початку туру:</strong> ' . ($date ?: 'Не вказано') . '</li>';
$message_body .= '<li><strong>Кількість людей:</strong> ' . ($people_num ?: 'Не вказано') . '</li>';
$message_body .= '<li><strong>Додаткова інформація:</strong> ' . ($info ?: 'Не вказано') . '</li>';
$message_body .= '</ul>';
$message_body .= '</body></html>';

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'freemail.freehost.com.ua';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'mia@miatour.com.ua';
    $mail->Password   = 'fCeSNfrJA';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    // leader and owner
    $mail->setFrom('mia@miatour.com.ua', 'Запит на подорож');
    $mail->addAddress($to_email, 'Miatour');

    // sheet contents
    $mail->CharSet = 'UTF-8';
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = $message_body;
    $mail->AltBody = $message_body;

    $mail->send();

    // if sheet sent successfully
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Ваша заявка успішно відправлена!']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => "На жаль, під час відправлення заявки сталася помилка: {$mail->ErrorInfo}"]);
}
?>