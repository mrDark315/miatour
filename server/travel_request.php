<?php
require __DIR__ . '/../vendor/autoload.php';
date_default_timezone_set('Europe/Kyiv');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

// Проверяем, что запрос был отправлен методом POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Некоректний метод запиту.']);
    exit;
}

// Получаем и очищаем данные из POST-запроса
$name = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name'])) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$date = isset($_POST['date']) ? htmlspecialchars(trim($_POST['date'])) : '';
$country = isset($_POST['country']) ? htmlspecialchars(trim($_POST['country'])) : '';
$city = isset($_POST['city']) ? htmlspecialchars(trim($_POST['city'])) : '';
$people_num = isset($_POST['people_num']) ? htmlspecialchars(trim($_POST['people_num'])) : '';
$info = isset($_POST['info']) ? htmlspecialchars(trim($_POST['info'])) : '';

// Перевірка обов'язкових input
if (empty($name) || empty($email) || empty($country)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Будь-ласка, заповніть обов\'язкові поля: Ім\'я, email, Дата, Країна.']);
    exit;
}

// Дополнительная валидация email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Невірний формат електронної пошти.']);
    exit;
}

$to_email = 'mia@miatour.com.ua';
// $to_email = 'ashykhmin04@gmail.com';
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

    // Відправник і одержувач
    $mail->setFrom('mia@miatour.com.ua', 'Запит на подорож');
    $mail->addAddress($to_email, 'Mia Tour');

    // Зміст листа
    $mail->CharSet = 'UTF-8';
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = $message_body;
    $mail->AltBody = $message_body;

    $mail->send();

    // Якщо лист відправлено успішно
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Ваша заявка успішно відправлена!']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => "На жаль, під час відправлення заявки сталася помилка: {$mail->ErrorInfo}"]);
}
?>