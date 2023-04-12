document.onload = testToken();

function testToken() {
  if (document.cookie.indexOf("token") == -1) {
    window.location = "http://127.0.0.1:5502/accueil/accueil.html";
  }
  else {
    getEvaluation();
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
let numero_evaluation = 0;


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
  console.log(data.length);

  for (i = 0; i < data.length; i++) {
    data_evaluation = data[[i]]["TITRE"];
    points_evaluation = data[[i]]["POINTS_TOTAL"];
    console.log(data_evaluation);

    const show_data = "showEvaluation('" + data_evaluation + "')"
    console.log(show_data);

    const div = document.createElement('div');
    div.append(data_evaluation + " (" + points_evaluation + " points)");
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
    document.cookie = 'num_evaluation_modifier=' + num_evaluation + '; max-age= 3600';
    numero_evaluation = num_evaluation;

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
    tr.append(tableauTEST[count]);
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

async function deleteEval() {
    let text = "Êtes-vous sûr de vouloir supprimer cette évaluation ?";
    if (confirm(text) == true) {
      let url = "http://0.0.0.0:8055/items/EVALUATION/" + numero_evaluation + "?access_token=" + recupererCookie("token");

      const data = await fetch(url, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
      })
      if (data.ok) {
        location.reload();
      }
      else {
        console.log("ERREUR");
      }
    } else {
    }
}


function showEvaluation(value) {
  document.querySelector(".text_evaluation").value = value;
  getNumEvaluation(value);
}


let dropdown_evaluation = document.querySelector(".dropdown_evaluation")
dropdown_evaluation.onclick = function () {
  dropdown_evaluation.classList.toggle("active")
}

