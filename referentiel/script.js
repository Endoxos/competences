document.onload = testToken();

function testToken() {
  if (document.cookie.indexOf("token") == -1) {
    window.location = "http://127.0.0.1:5502/accueil/accueil.html";
  }
  else {
    getBloc();
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

async function getBloc() {

  let url = "http://0.0.0.0:8055/items/BLOC?access_token=" + recupererCookie("token");

  const data = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  })
  if (data.ok) {

    const response = await data.json();
    data_bloc_response = response;
    getDataBloc(data_bloc_response);

  }
  else {
    console.log("ERREUR");
  }
}

function getDataBloc(value) {
  data = value["data"];
  console.log(data.length);

  for (i = 0; i < data.length; i++) {
    data_bloc = data[[i]]["NOM_BLOC"];
    console.log(data_bloc);

    const show_data = "showBloc('" + data_bloc + "')"

    const div = document.createElement('div');
    div.append(data_bloc);
    div.setAttribute("onclick", show_data);
    options_bloc.append(div);
  }
}






async function getNumBloc(value) {

  let url = "http://0.0.0.0:8055/items/BLOC?access_token=" + recupererCookie("token") +"&filter[NOM_BLOC]=" + value;

  const data = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  })
  if (data.ok) {
    const response = await data.json();
    data_numbloc_response = response;

    num_bloc = data_numbloc_response["data"]["0"]["NUM_BLOC"];

    getDomaine(num_bloc);
  }
  else {
    console.log("ERREUR");
  }
}

async function getDomaine(value) {

  let url = "http://0.0.0.0:8055/items/DOMAINE?access_token=" + recupererCookie("token") +"&filter[NUM_BLOC]=" + value;

  const data = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  })
  if (data.ok) {
    const response = await data.json();
    data_domaine_response = response;
    console.log(data_domaine_response);
    getDataDomaine(data_domaine_response);
  }
  else {
    console.log("ERREUR");
  }
}

function getDataDomaine(value) {
  data = value["data"];
  console.log(data.length);

  const domaine_replace = document.createElement('div');
  domaine_replace.append('');
  domaine_replace.setAttribute("id", "domaine_replace");
  options_domaine.replaceChildren(domaine_replace);
  domaine_replace.remove();

  for (i = 0; i < data.length; i++) {
    data_domaine = data[[i]]["NOM_DOMAINE"];
    console.log(data_domaine);

    const show_data = "showDomaine('" + data_domaine + "')"

    const div = document.createElement('div');
    div.append(data_domaine);
    div.setAttribute("onclick", show_data);
    div.setAttribute("id", "domaine");
    options_domaine.append(div);
  }
}






async function getNumDomaine(value) {

  let url = "http://0.0.0.0:8055/items/DOMAINE?access_token=" + recupererCookie("token") +"&filter[NOM_DOMAINE]=" + value;

  const data = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  })
  if (data.ok) {
    const response = await data.json();
    data_numdomaine_response = response;

    num_domaine = data_numdomaine_response["data"]["0"]["NUM_DOMAINE"];

    getCompetence(num_domaine);
  }
  else {
    console.log("ERREUR");
  }
}

async function getCompetence(value) {

  let url = "http://0.0.0.0:8055/items/COMPETENCE?access_token=" + recupererCookie("token") +"&filter[NUM_DOMAINE]=" + value;

  const data = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  })
  if (data.ok) {
    const response = await data.json();
    data_competence_response = response;
    console.log(data_competence_response);
    getDataCompetence(data_competence_response);
  }
  else {
    console.log("ERREUR");
  }
}

function getDataCompetence(value) {
  data = value["data"];
  console.log(data.length);

  const competence_replace = document.createElement('div');
  competence_replace.append('');
  competence_replace.setAttribute("id", "competence_replace");
  div_competence.replaceChildren(competence_replace);
  competence_replace.remove();

  for (i = 0; i < data.length; i++) {
    data_num_competence = data[[i]]["NUM_COMPETENCE"];
    data_nom_competence = data[[i]]["NOM_COMPETENCE"];
    console.log(data);


    const div_num = document.createElement('div');
    div_num.append("Compétence n°: ");
    div_num.append(data_num_competence);
    div_num.setAttribute("class", "num_competence");
    div_competence.append(div_num);

    const div_nom = document.createElement('div');
    div_nom.append(data_nom_competence);
    div_competence.append(div_nom);

    const br = document.createElement('br');
    div_competence.append(br);

  }
}




function showBloc(value) {
  document.querySelector(".text_bloc").value = value;
  getNumBloc(value);
}

function showDomaine(value) {
  document.querySelector(".text_domaine").value = value;
  getNumDomaine(value);
}

let dropdown_bloc = document.querySelector(".dropdown_bloc")
dropdown_bloc.onclick = function () {
  dropdown_bloc.classList.toggle("active")
}

let dropdown_domaine = document.querySelector(".dropdown_domaine")
dropdown_domaine.onclick = function () {
  dropdown_domaine.classList.toggle("active")
}

