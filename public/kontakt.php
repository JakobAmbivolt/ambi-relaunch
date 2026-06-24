<?php
// Kontaktformular-Versand per PHP mail().
// Erwartet einen POST mit JSON-Body vom Formular (src/components/forms/ContactForm.tsx)
// und verschickt die Anfrage an das Postfach unten ($to).
// Funktioniert nur auf PHP-fähigem Hosting (klassisches Webhosting), nicht im
// Next.js-Vorschauserver.

header('Content-Type: application/json; charset=utf-8');

// ── Empfänger ────────────────────────────────────────────────────────────────
$to   = 'anfrage@ambivolt.de';
// Absender MUSS eine Adresse eurer eigenen Domain sein (sonst Spam/Ablehnung).
$from = 'anfrage@ambivolt.de';

// ── Nur POST zulassen ────────────────────────────────────────────────────────
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Methode nicht erlaubt.']);
    exit;
}

// ── Eingaben lesen (JSON-Body, Fallback: klassisches Formular) ────────────────
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST;
}

function field(array $d, string $key): string {
    return isset($d[$key]) ? trim((string) $d[$key]) : '';
}

$profil      = field($data, 'profil');
$name        = field($data, 'name');
$email       = field($data, 'email');
$telefon     = field($data, 'telefon');
$nachricht   = field($data, 'nachricht');
$datenschutz = !empty($data['datenschutz']);
$honeypot    = field($data, 'website');

// ── Honeypot: Bots erhalten ein „ok", es wird aber nichts versendet ───────────
if ($honeypot !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

// ── Serverseitige Validierung (Client nie vertrauen) ──────────────────────────
if ($profil === '' || $name === '' || $telefon === '' || !$datenschutz
    || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Bitte füllen Sie alle Pflichtfelder korrekt aus.']);
    exit;
}

// ── Header-Injection verhindern: CR/LF aus Header-Werten entfernen ────────────
$safeName  = str_replace(["\r", "\n"], ' ', $name);
$safeEmail = str_replace(["\r", "\n"], '', $email);

// ── Betreff (UTF-8 MIME-kodiert) + Textkörper ─────────────────────────────────
$subject = 'Kontaktanfrage über die Website – ' . $safeName;
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$body = implode("\r\n", [
    'Profil:  ' . $profil,
    'Name:    ' . $name,
    'E-Mail:  ' . $email,
    'Telefon: ' . $telefon,
    '',
    'Nachricht:',
    $nachricht !== '' ? $nachricht : '(keine Nachricht)',
]);

$headers = implode("\r\n", [
    'From: AmbiVolt Website <' . $from . '>',
    'Reply-To: ' . $safeName . ' <' . $safeEmail . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

// ── Versand ───────────────────────────────────────────────────────────────────
// 5. Parameter '-f': Envelope-Absender setzen (auf Strato empfohlen, sonst
// versendet der Server von einer apache@-Adresse und die Mail wird oft abgelehnt).
$ok = @mail($to, $encodedSubject, $body, $headers, '-f' . $from);

if ($ok) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Der Versand ist fehlgeschlagen. Bitte kontaktieren Sie uns direkt per Telefon oder E-Mail.']);
}
