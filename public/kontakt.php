<?php
// Einfacher Kontaktformular-Versand per PHP mail() + Log zur Fehlersuche.
// Läuft auf PHP-Hosting (Strato), NICHT im lokalen Next-Vorschauserver.
// Das Log liegt als kontakt-log.txt neben dieser Datei (enthält keine Kundendaten,
// nur Zeitpunkt + Erfolg/Fehler) — so lassen sich Versandprobleme nachvollziehen.

header('Content-Type: application/json; charset=utf-8');

$to  = 'anfrage@ambivolt.de';
$from = 'anfrage@ambivolt.de';
$log = __DIR__ . '/kontakt-log.txt';

function schreibeLog($log, $text) {
    @file_put_contents($log, '[' . date('d.m.Y H:i:s') . '] ' . $text . "\n", FILE_APPEND);
}

// Daten vom Formular lesen (JSON, sonst klassisches Formular-POST)
$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
    $data = $_POST;
}

$profil    = trim($data['profil']    ?? '');
$name      = trim($data['name']      ?? '');
$email     = trim($data['email']     ?? '');
$telefon   = trim($data['telefon']   ?? '');
$nachricht = trim($data['nachricht'] ?? '');

// Zeilenumbrüche aus der E-Mail entfernen (verhindert Missbrauch des Formulars)
$email = str_replace(["\r", "\n"], '', $email);

// Minimaler Check: ohne gültige E-Mail + Namen kein Versand
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $name === '') {
    schreibeLog($log, 'ABGELEHNT: ungueltige Eingabe');
    http_response_code(400);
    echo json_encode(['ok' => false]);
    exit;
}

$subject = 'Neue Kontaktanfrage ueber die Website';
$body =
    "Profil:   $profil\n" .
    "Name:     $name\n" .
    "E-Mail:   $email\n" .
    "Telefon:  $telefon\n\n" .
    "Nachricht:\n$nachricht\n";

$headers =
    "From: $from\r\n" .
    "Reply-To: $email\r\n" .
    "Content-Type: text/plain; charset=UTF-8";

$ok = mail($to, $subject, $body, $headers, '-f' . $from);

if ($ok) {
    schreibeLog($log, 'OK: Mail an ' . $to . ' uebergeben');
    echo json_encode(['ok' => true]);
} else {
    $fehler = error_get_last();
    schreibeLog($log, 'FEHLER: mail() = false – ' . ($fehler['message'] ?? 'kein Grund angegeben'));
    http_response_code(500);
    echo json_encode(['ok' => false]);
}
