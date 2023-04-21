<?php
if(isset($_POST['email'])) {
    $email = $_POST['email'];
    $titre = $_POST['titre'];
    $points = $_POST['points'];
    $remarque = $_POST['remarque'];

    $subject = "Résultat de l'évaluation $titre";
    $message = "<html><body style='color:black; font-size:20px'>";
    $message .= "<p style='font-weight:bold; text-align:center'>Vos résultats concernant l'évaluation : $titre sont disponibles !</p>";
    $message .= "<p><hr noshade style='align:center; width:'90%''></p>";
    $message .= "<p>Remarque : $remarque</p>";
    $message .= "<p>Note obtenue : $points</p>";
    $message .= "<p style='font-weight:bold; text-align:center'>Pour plus de détails, vous pouvez consultez vos résultats sur votre compte COMPÉTENCES en ligne.</p>";
    $message .= "</body></html>";

    $headers = 'From: competences' . "\r\n" .
        'Reply-To: competences' . "\r\n" .
        'X-Mailer: PHP/' . phpversion() . "\r\n" .
        'Content-type: text/html; charset=UTF-8' . "\r\n";

    mail($email, $subject, $message, $headers);
}
?>
