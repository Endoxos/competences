document.onload = testToken();

function testToken() {
  if (document.cookie.indexOf("token") == -1) {
    window.location = "/index.html";
  }
  else {
    getEvaluation();
    getCollaborateur();
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

const tableauTEST = [];
let count = 0;
let num_evaluation_choisi = "";
let num_collaborateur_choisi = "";
let num_critere = 0;

async function getEvaluation() {

  let url = "http://0.0.0.0:8055/items/EVALUATION?access_token=" + recupererCookie("token");

  const data = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  })
  if (data.ok) {

    const response = await data.json();
    data_evaluation_response = response;
    getDataEvaluation(data_evaluation_response);

  }
  else {
    console.log("ERREUR");
  }
}

function getDataEvaluation(value) {
  data = value["data"];

  for (i = 0; i < data.length; i++) {
    data_evaluation = data[[i]]["TITRE"];
    points_evaluation = data[[i]]["POINTS_TOTAL"];
    console.log(data_evaluation);

    const show_data = "showBloc('" + data_evaluation + "')"

    const div = document.createElement('div');
    div.append(data_evaluation + " (" + points_evaluation + " points)");
    div.setAttribute("onclick", show_data);
    options_bloc.append(div);
  }
}

async function getNumEvaluation(value) {

  let url = "http://0.0.0.0:8055/items/EVALUATION?access_token=" + recupererCookie("token") + "&filter[TITRE]=" + value;

  const data = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  })
  if (data.ok) {
    const response = await data.json();
    data_numevaluation_response = response;
    num_evaluation = data_numevaluation_response["data"]["0"]["ID_EVALUATION"];
    num_evaluation_choisi = num_evaluation;
    console.log(num_evaluation_choisi);

    getCritere(num_evaluation);

  }
  else {
    console.log("ERREUR");
  }
}

async function getCritere(value) {

  let url = "http://0.0.0.0:8055/items/CRITERE?access_token=" + recupererCookie("token") + "&filter[ID_EVALUATION]=" + value;

  const data = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  })
  if (data.ok) {
    const response = await data.json();
    data_critere_response = response;
    getDataCritere(data_critere_response);
  }
  else {
    console.log("ERREUR");
  }
}

function getDataCritere(value) {
  datacritere = value["data"];
  console.log(datacritere);

  const critere_replace = document.createElement('tr');
  critere_replace.append('');
  table_critere.replaceChildren(critere_replace);

  for (i = 0; i < datacritere.length; i++) {

    num_critere = datacritere.length;

    data_intitule = datacritere[[i]]["INTITULE"];

    const div = document.createElement('div');
    div.append(data_intitule);
    div.setAttribute("class", "critere");
    table_critere.append(div);

    const input = document.createElement('input');
    input.setAttribute("class", "points");
    input.setAttribute("placeholder", "Écrire le nombre de points obtenu pour le critère");
    input.setAttribute('data-numinput', i);

    table_critere.append(input);
  }
}

let arrayNote = [];
function recupererNote() {
  for (let recupererNote = 0; recupererNote < num_critere; recupererNote++) {
    arrayNote.push(document.querySelectorAll('[data-numinput="' + [recupererNote] + '"]')[0].value);
  }
  arrayNote = arrayNote.join('/');
  console.log(arrayNote);
}

async function getCollaborateur() {

  let url = "http://0.0.0.0:8055/items/USER?access_token=" + recupererCookie("token") + "&filter[IDENTITE]=Collaborateur";

  const data = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  })
  if (data.ok) {

    const response_user = await data.json();
    getDataCollaborateur(response_user);

  }
  else {
    console.log("ERREUR");
  }
}

function getDataCollaborateur(value) {
  data_user = value["data"];

  for (i = 0; i < data_user.length; i++) {
    nom_user = data_user[[i]]["USER"];
    console.log(nom_user);

    const show_data = "showDomaine('" + nom_user + "')"

    const div_user = document.createElement('div');
    div_user.append(nom_user);
    div_user.setAttribute("onclick", show_data);
    options_domaine.append(div_user);
  }
}

async function getNumUser(value) {

  let url = "http://0.0.0.0:8055/items/USER?access_token=" + recupererCookie("token") + "&filter[USER]=" + value;

  const data = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  })
  if (data.ok) {
    const response_id_user = await data.json();
    num_collaborateur_choisi = response_id_user["data"]["0"]["ID_USER"];
    console.log(num_collaborateur_choisi);

  }
  else {
    console.log("ERREUR");
  }
}

async function updateEvalUser() {

  recupererNote();

  var nombre_points = document.getElementById('text_points').value;
  var remarque = document.getElementById('text_remarque').value;

  let url = "http://0.0.0.0:8055/items/USER_COMPETENCES?access_token=" + recupererCookie("token");

  const data = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      "ID_USER": `${num_collaborateur_choisi}`,
      "ID_EVALUATION": `${num_evaluation_choisi}`,
      "POINTS_EVALUATION": `${nombre_points}`,
      "POINTS_CRITERE": `${arrayNote}`,
      "REMARQUE": `${remarque}`

    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  if (data.ok) {
    const response = await data.json();
    console.log(response);
    window.alert("Évaluation assignée avec succès!");
    window.location = "/afficher_evaluation/afficher_evaluation.html";
  }
  else {
    console.log("ERREUR");
  }
}











function showBloc(value) {
  document.querySelector(".text_bloc").value = value;
  getNumEvaluation(value);
}

function showDomaine(value) {
  document.querySelector(".text_domaine").value = value;
  getNumUser(value);
}

let dropdown_bloc = document.querySelector(".dropdown_bloc")
dropdown_bloc.onclick = function () {
  dropdown_bloc.classList.toggle("active")
}

let dropdown_domaine = document.querySelector(".dropdown_domaine")
dropdown_domaine.onclick = function () {
  dropdown_domaine.classList.toggle("active")
}

