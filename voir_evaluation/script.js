document.onload = testToken();

function testToken() {
  if (document.cookie.indexOf("token") == -1) {
    window.location = "/accueil.html";
  }
  else {
    getIdUser();
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
const tableauEval = [];
const tableauNomEval = [];
const tableauPointsEval = [];
let nombre_points = "";
let count = 0;
let points_critere_data = "";
let titre_eval_export = "";

async function getIdUser() {

  let url = "http://0.0.0.0:8055/items/USER?access_token=" + recupererCookie("token") + "&filter[USER]=" + recupererCookie("user");

  const data = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  })
  if (data.ok) {

    const response_id_user = await data.json();
    id_user = response_id_user["data"][0]["ID_USER"]
    getEvaluationObtenu(id_user);

  }
  else {
    console.log("ERREUR");
  }
}

async function getEvaluationObtenu(value) {

  let url = "http://0.0.0.0:8055/items/USER_COMPETENCES?access_token=" + recupererCookie("token") + "&filter[ID_USER]=" + value;

  const data = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  })
  if (data.ok) {

    const response_eval_obtenu = await data.json();
    data_eval_obtenu = response_eval_obtenu["data"];

    for (i = 0; i < data_eval_obtenu.length; i++) {
      eval_obtenu = data_eval_obtenu[i]["ID_EVALUATION"];
      tableauEval.push(eval_obtenu);
    }
    getEvaluation();
  }
  else {
    console.log("ERREUR");
  }
}



async function getEvaluation() {

  for (i = 0; i < tableauEval.length; i++) {

    let url = "http://0.0.0.0:8055/items/EVALUATION?access_token=" + recupererCookie("token") + "&filter[ID_EVALUATION]=" + tableauEval[i];

    const data = await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      },
    })
    if (data.ok) {

      const response_evaluation = await data.json();
      nom_evaluation = response_evaluation["data"][0]["TITRE"]
      tableauNomEval.push(nom_evaluation);

      points_evaluation = response_evaluation["data"][0]["POINTS_TOTAL"]
      tableauPointsEval.push(points_evaluation);
      console.log(tableauNomEval);
      console.log(tableauPointsEval);

    }
    else {
      console.log("ERREUR");
    }
  }
  getDataEvaluation();
}

function getDataEvaluation() {

  for (i = 0; i < tableauNomEval.length; i++) {

    const show_data = "showEvaluation('" + tableauNomEval[i] + "')"

    const div = document.createElement('div');
    div.append(tableauNomEval[i] + " (" + tableauPointsEval[i] + " points)");
    div.setAttribute("onclick", show_data);
    options_evaluation.append(div);
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
    nombre_points = data_numevaluation_response["data"]["0"]["POINTS_TOTAL"]
    getPointsObtenu(num_evaluation);
  }
  else {
    console.log("ERREUR");
  }
}

async function getPointsObtenu(value) {

  let url = "http://0.0.0.0:8055/items/USER_COMPETENCES?access_token=" + recupererCookie("token") + "&filter[ID_EVALUATION]=" + value;

  const data = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  })
  if (data.ok) {
    const response_points_obtenu = await data.json();

    points_evaluation_data = response_points_obtenu["data"][0]["POINTS_EVALUATION"];
    points_critere_data = response_points_obtenu["data"][0]["POINTS_CRITERE"];
    remarque_data = response_points_obtenu["data"][0]["REMARQUE"];

    const critere_replace = document.createElement('tr');
    critere_replace.append('');
    table_critere.replaceChildren(critere_replace);

    // -----------------------------------------------------------------------------------

    const trPoints = document.createElement('tr');
    trPoints.append("Note de l'évaluation : " + points_evaluation_data + "/" + nombre_points);
    trPoints.setAttribute("class", "competence");
    table_critere.append(trPoints);

    const trspace = document.createElement('tr');
    trspace.append("ㅤ");
    table_critere.append(trspace);

    // -----------------------------------------------------------------------------------

    const trRemarque = document.createElement('tr');
    trRemarque.append("Remarque : " + remarque_data);
    trRemarque.setAttribute("class", "competence");
    table_critere.append(trRemarque);

    const trspace2 = document.createElement('tr');
    trspace2.append("ㅤ");
    table_critere.append(trspace2);

    getPointsObtenuEcrire(value);
  }
  else {
    console.log("ERREUR");
  }
}

async function getPointsObtenuEcrire(value) {

  let url = "http://0.0.0.0:8055/items/USER_COMPETENCES?access_token=" + recupererCookie("token") + "&filter[ID_EVALUATION]=" + value;

  const data = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  })
  if (data.ok) {

    const response_eval_obtenu = await data.json();
    console.log(response_eval_obtenu);

    getCritere(value);
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

  points_critere_data = points_critere_data.split('/');

  for (i = 0; i < datacritere.length; i++) {
    data_intitule = datacritere[[i]]["INTITULE"];
    tableauTEST.push(data_intitule);
  }

  for (i = 0; i < datacritere.length; i++) {
    id_critere = datacritere[[i]]["ID_CRITERE"];
    getCC(id_critere);
    console.log(tableauTEST);

  }
}

async function getCC(value) {

  let url = "http://0.0.0.0:8055/items/COMPETENCES_CRITERE?access_token=" + recupererCookie("token") + "&filter[ID_CRITERE]=" + value;

  const data = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  })
  if (data.ok) {

    const data_cc_response = await data.json();
    data_cc = data_cc_response["data"];

    const tr = document.createElement('tr');
    tr.append(tableauTEST[count] + " (Note : " + points_critere_data[count] + ")");
    tr.setAttribute("class", "critere");
    table_critere.append(tr);

    count = count + 1;

    for (i = 0; i < data_cc.length; i++) {
      data_num_competence = data_cc[[i]]["NOM_COMPETENCE"];
      console.log(data_num_competence);
      const trCompetence = document.createElement('tr');
      trCompetence.append(data_num_competence);
      trCompetence.setAttribute("class", "competence");
      table_critere.append(trCompetence);

      const trspace = document.createElement('tr');
      trspace.append("ㅤ");
      table_critere.append(trspace);
    }
  }
  else {
    console.log("ERREUR");
  }
}

function showEvaluation(value) {
  document.querySelector(".text_evaluation").value = value;
  getNumEvaluation(value);
  titre_eval_export = value;
}

let dropdown_evaluation = document.querySelector(".dropdown_evaluation")
dropdown_evaluation.onclick = function () {
  dropdown_evaluation.classList.toggle("active")
}

function generatePDF() {
  var element = document.getElementById('table_critere');
  var opt = {
    margin: 0.10,
    filename: 'Résultats de ' + titre_eval_export + ' (' + recupererCookie("user") + ').pdf',
    image: { type: 'jpeg', quality: 0.98},
    html2canvas: {scale: 4},
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait'}
  };

  html2pdf(element, opt);  
}