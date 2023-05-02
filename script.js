document.onload = testToken();

function testToken() {
    if (document.cookie.indexOf("token") == -1) {
    }
    else {
reidentification();
    };
}

function recupererCookie(nom) {
    nom = nom + "=";
    var liste = document.cookie.split(';');
    for (var i = 0; i < liste.length; i++) {
      var c = liste[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nom) == 0) return c.substring(nom.length, c.length);
    }
    return null;
  }


async function identification() {

    let url = "http://0.0.0.0:8055/items/USER?access_token=" + recupererCookie("token") + "&filter[USER]=" + recupererCookie("user")

    const data = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (data.ok) {

        const response_id = await data.json();

        id = response_id["data"]["0"]["IDENTITE"];

        if (id == "RH") {

            const button_replace = document.createElement('p');
            button_replace.append('');
            div_button.replaceChildren(button_replace);

            const buttonReferentiel = document.createElement('button');
            buttonReferentiel.setAttribute("onclick", "location.href='/referentiel/referentiel.html'");
            buttonReferentiel.append("VOIR LE RÉFÉRENTIEL");

            const buttonGererEvaluation = document.createElement('button');
            buttonGererEvaluation.setAttribute("onclick", "location.href='/afficher_evaluation/afficher_evaluation.html'");
            buttonGererEvaluation.append("GÉRER LES ÉVALUATIONS");

            div_button.append(buttonReferentiel, buttonGererEvaluation);

            const buttonDeconnexion = document.createElement('button');
            buttonDeconnexion.append("SE DECONNECTER");
            buttonDeconnexion.setAttribute("class", "deconnexion");
            buttonDeconnexion.setAttribute("onclick", "eraseToken()");
            button_login.replaceChildren(buttonDeconnexion);
        } else {

            const button_replace = document.createElement('p');
            button_replace.append('');
            div_button.replaceChildren(button_replace);

            const buttonReferentiel = document.createElement('button');
            buttonReferentiel.setAttribute("onclick", "location.href='/referentiel/referentiel.html'");
            buttonReferentiel.append("VOIR LE RÉFÉRENTIEL");

            const buttonVoirEvaluation = document.createElement('button');
            buttonVoirEvaluation.setAttribute("onclick", "location.href='/voir_evaluation/voir_evaluation.html'");
            buttonVoirEvaluation.append("VOIR LES RÉSULTATS D'ÉVALUATIONS");

            div_button.append(buttonReferentiel, buttonVoirEvaluation);

            const buttonDeconnexion = document.createElement('button');
            buttonDeconnexion.append("SE DECONNECTER");
            buttonDeconnexion.setAttribute("class", "deconnexion");
            buttonDeconnexion.setAttribute("onclick", "eraseToken()");
            button_login.replaceChildren(buttonDeconnexion);
        }

    }
    else {
        console.log("ERREUR");
        erreur();
    }
}

async function reidentification() {

    let url = "http://0.0.0.0:8055/items/USER?access_token=" + recupererCookie("token") + "&filter[USER]=" + recupererCookie("user")

    const data = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (data.ok) {

        const response_id = await data.json();

        id = response_id["data"]["0"]["IDENTITE"];

        if (id == "RH") {

            const button_replace = document.createElement('p');
            button_replace.append('');
            div_button.replaceChildren(button_replace);

            const buttonReferentiel = document.createElement('button');
            buttonReferentiel.setAttribute("onclick", "location.href='/referentiel/referentiel.html'");
            buttonReferentiel.append("VOIR LE RÉFÉRENTIEL");

            const buttonGererEvaluation = document.createElement('button');
            buttonGererEvaluation.setAttribute("onclick", "location.href='/afficher_evaluation/afficher_evaluation.html'");
            buttonGererEvaluation.append("GÉRER LES ÉVALUATIONS");

            div_button.append(buttonReferentiel, buttonGererEvaluation);

            const buttonDeconnexion = document.createElement('button');
            buttonDeconnexion.append("SE DECONNECTER");
            buttonDeconnexion.setAttribute("class", "deconnexion");
            buttonDeconnexion.setAttribute("onclick", "eraseToken()");
            button_login.replaceChildren(buttonDeconnexion);
        } else {

            const button_replace = document.createElement('p');
            button_replace.append('');
            div_button.replaceChildren(button_replace);

            const buttonReferentiel = document.createElement('button');
            buttonReferentiel.setAttribute("onclick", "location.href='/referentiel/referentiel.html'");
            buttonReferentiel.append("VOIR LE RÉFÉRENTIEL");

            const buttonVoirEvaluation = document.createElement('button');
            buttonVoirEvaluation.setAttribute("onclick", "location.href='/voir_evaluation/voir_evaluation.html'");
            buttonVoirEvaluation.append("VOIR LES RÉSULTATS D'ÉVALUATIONS");

            div_button.append(buttonReferentiel, buttonVoirEvaluation);

            const buttonDeconnexion = document.createElement('button');
            buttonDeconnexion.append("SE DECONNECTER");
            buttonDeconnexion.setAttribute("class", "deconnexion");
            buttonDeconnexion.setAttribute("onclick", "eraseToken()");
            button_login.replaceChildren(buttonDeconnexion);
        }

    }
    else {
        console.log("ERREUR");
        erreur();
    }
}




async function connexion() {

    let url = "http://0.0.0.0:8055/auth/login";
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            "email": `${email}`,
            "password": `${password}`
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (data.ok) {

        document.cookie = 'user=' + email + '; max-age= 3600';

        const response = await data.json();

        access_token = response["data"]["access_token"];
        document.cookie = 'token=' + access_token + '; max-age= 3600';

        const erreur_replace = document.createElement('p');
        erreur_replace.append('');
        erreur_login.replaceChildren(erreur_replace);

        identification();

    }
    else {
        console.log("ERREUR");
        erreur();
    }
}


function erreur() {

    const p = document.createElement('p');
    p.append('EMAIL OU MOT DE PASSE INVALIDE');
    erreur_login.replaceChildren(p);

}

function eraseToken() {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    window.location = "/index.html";
}



/*
const div = document.createElement('div');
div.appendChild(document.createTextNode('TEST'));
div.style.color = 'red';

divlogin.append(div);
        .replaceChildren(p);

*/