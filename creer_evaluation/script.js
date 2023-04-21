document.onload = testToken();

function testToken() {
    if (document.cookie.indexOf("token") == -1) {
        window.location = "/accueil.html";
    }
    else {
        getCompetence();
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


let listArray = [];
let listCompetence = [];
let countSentCritere = 0;

async function getCompetence() {

    let url = "http://0.0.0.0:8055/items/COMPETENCE?access_token=" + recupererCookie("token");

    const data = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    })
    if (data.ok) {

        const competence_response = await data.json();
        writeCompetence(competence_response);

    }
    else {
        console.log("ERREUR");
    }
}

function writeCompetence(value) {
    data = value["data"];
    const select = document.createElement('select');
    select.setAttribute('class', 'select_competence');
    select.setAttribute('onclick', 'selected(this)');

    for (i = 0; i < data.length; i++) {
        const data_competence = data[[i]]["NOM_COMPETENCE"];
        listCompetence.push(data_competence);
        const options = document.createElement('option');
        options.setAttribute('value', '0');
        options.append(data_competence);
        select.append(options);
    }
    competence_add0.append(select);
    reloadcheckbox();
}

async function pushEvaluation() {

    var titre = document.getElementById('titre').value;
    var points = document.getElementById('points').value;

    let url = "http://0.0.0.0:8055/items/EVALUATION?access_token=" + recupererCookie("token");

    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            "TITRE": `${titre}`,
            "POINTS_TOTAL": `${points}`
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (data.ok) {
        const response = await data.json();
        num_evaluation = response["data"]["ID_EVALUATION"];
        console.log(response);
        pushCritere(num_evaluation);
    }
    else {
        console.log("ERREUR");
        window.alert("Titre d'évaluation et/ou nombre de points manquants");
    }
}

async function pushCritere(value) {

    for (let f = 0; f < arrayNumberSelect.length; f++) {
        var titreInput = document.querySelectorAll('[data-numinput="' + [f] + '"]')[0].value;

        let url = "http://0.0.0.0:8055/items/CRITERE?access_token=" + recupererCookie("token");

        const data = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                "ID_EVALUATION": `${value}`,
                "INTITULE": `${titreInput}`
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (data.ok) {
            const response = await data.json();
            num_critere = response["data"]["ID_CRITERE"];
            update(num_critere, f);
        }
        else {
            console.log("ERREUR");
        }
    }
}

function update(num_critere, f) {
    for (i = 0; i < arrayNumberSelect[f]; i++) {
        updatetable(i, num_critere);
        countSentCritere++;
    }
}

async function updatetable(i, num_critere) {

    let url = "http://0.0.0.0:8055/items/COMPETENCES_CRITERE?access_token=" + recupererCookie("token");

    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            "ID_CRITERE": `${num_critere}`,
            "NOM_COMPETENCE": `${arraySelectedCompetence[countSentCritere]}`
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (data.ok) {
        const response = await data.json();
        console.log(response);
    }
    else {
        console.log("ERREUR");
    }
    console.log(countSentCritere);
}

function reloadcheckbox() {

    var checkboxes = document.querySelectorAll('.checkbox');

    for (var checkbox of checkboxes) {
        checkbox.addEventListener('click', function () {
            if (this.checked == true) {
                listArray.push(this.value);
            }
            else {
                listArray = listArray.filter(e => e !== this.value);
            }
        })
    }
}

let arrayTitre = [];
let arrayNumberSelect = [1];
let arraySelectedCompetence = [];
let countCompetence = 0;
let countCritere = 0;

function selected(element) {
    var index = element.selectedIndex;
    var value = element.options[index].value;
    var content = element.options[index].innerHTML;

    arraySelectedCompetence[value] = content;

    console.log(arraySelectedCompetence);
}

function ajouterCompetence() {
    countCompetence++;
    arrayNumberSelect[arrayNumberSelect.length - 1] += 1;
    const select = document.createElement('select');
    select.setAttribute('id', 'competence_num' + countCompetence);
    select.setAttribute('class', 'select_competence');
    select.setAttribute('onclick', 'selected(this)');

    for (let a = 0; a < listCompetence.length; a++) {
        const options = document.createElement('option');
        options.setAttribute('value', countCompetence);
        options.append(listCompetence[a]);
        select.append(options);
    }
    document.getElementById('competence_add' + countCritere).append(select);
}

function supprimerCompetence() {
    document.getElementById('competence_num' + (countCompetence)).remove();
    countCompetence--;
    arraySelectedCompetence.splice((countCompetence + 1), 1);
    arrayNumberSelect[arrayNumberSelect.length - 1] -= 1;
}

function ajouterCritere() {
    arrayNumberSelect.push(1);
    countCritere++;
    countCompetence++;
    const hr = document.createElement('hr');
    const input = document.createElement('input');
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');

    div1.setAttribute('id', 'critere_num' + countCritere);

    div2.setAttribute('id', 'competence_add' + countCritere);

    input.setAttribute('data-numinput', countCritere);
    input.setAttribute('class', 'critere1');
    input.setAttribute('type', 'text');
    input.setAttribute('maxlength', '200');
    input.setAttribute('id', 'critere1');
    input.setAttribute('placeholder', '200');
    input.setAttribute('placeholder', 'Écrire un titre de critère..');

    div1.append(hr, input, div2)

    critere_add.append(div1);

    const select = document.createElement('select');
    select.setAttribute('id', 'competence_num' + countCompetence);
    select.setAttribute('class', 'select_competence');
    select.setAttribute('onclick', 'selected(this)');

    for (let a = 0; a < listCompetence.length; a++) {
        const options = document.createElement('option');
        options.setAttribute('value', countCompetence);
        options.append(listCompetence[a]);
        select.append(options);
    }
    document.getElementById('competence_add' + countCritere).append(select);
}

function supprimerCritere() {
    document.getElementById('critere_num' + (countCritere)).remove();
    arrayNumberSelect.pop();
    countCompetence--;
    countCritere--;
    arraySelectedCompetence.splice(countCompetence + 1, 1);

}

function test() {
    let counttest = 0;
    for (let test = 0; test < arrayNumberSelect.length; test++) {
        var titreInput = document.querySelectorAll('[data-numinput="' + [test] + '"]')[0].value;
        console.log(titreInput)
        for (let test2 = 0; test2 < arrayNumberSelect[test]; test2++) {
            console.log(arraySelectedCompetence[counttest]);
            counttest++;
        }
    }
}
// --------------------------------------------------------------------------------------------------
// let countCritere = 0;
// function appendCritere() {
//     if (countCritere == 0) {

//         const hr = document.createElement('hr');

//         const input1 = document.createElement('input');
//         input1.setAttribute('class', 'critere2');
//         input1.setAttribute('type', 'text');
//         input1.setAttribute('maxlength', '200');
//         input1.setAttribute('id', 'critere2');
//         input1.setAttribute('placeholder', 'Écrire un titre de critère..');

//         div2critere.append(hr, input1);

//         const div1 = document.createElement('div');
//         div1.setAttribute('class', 'div_critere2');

//         const div2 = document.createElement('div');
//         div2.setAttribute('class', 'dropdown_critere2');

//         const input2 = document.createElement('input');
//         input2.setAttribute('class', 'text_critere2');
//         input2.setAttribute('type', 'text');
//         input2.setAttribute('placeholder', 'Choisir une compétence..');
//         input2.setAttribute('readonly', '');

//         const div3 = document.createElement('div');
//         div3.setAttribute('class', 'options2');
//         div3.setAttribute('id', 'options_competence2');

//         div2.append(input2, div3);
//         div1.append(div2);

//         div2critere.append(div1);

//         getCompetence2();

//         let dropdown_critere2 = document.querySelector(".dropdown_critere2")
//         dropdown_critere2.onclick = function () {
//             dropdown_critere2.classList.toggle("active")
//         }

//     }
// }

// async function getCompetence2() {

//     let url = "http://0.0.0.0:8055/items/COMPETENCE?access_token=" + recupererCookie("token");

//     const data = await fetch(url, {
//         method: "GET",
//         headers: {
//             'Content-Type': 'application/json'
//         },
//     })
//     if (data.ok) {

//         const competence_response = await data.json();
//         writeCompetence2(competence_response);

//     }
//     else {
//         console.log("ERREUR");
//     }
// }

// function writeCompetence2(value) {
//     data = value["data"];
//     for (i = 0; i < data.length; i++) {
//         data_competence = data[[i]]["NOM_COMPETENCE"];

//         const label = document.createElement('label');
//         label.setAttribute("for", data_competence);

//         const div = document.createElement('div');
//         label.append(div);

//         const input = document.createElement('input');
//         input.setAttribute("type", "checkbox");
//         input.setAttribute("id", data_competence);
//         input.setAttribute("class", "checkbox");
//         input.setAttribute("value", data_competence);

//         div.append(input);

//         div.append(data_competence)

//         options_competence2.append(label);
//     }
//     reloadcheckbox2();
// }

// function reloadcheckbox2() {

//     var checkboxes = document.querySelectorAll('.checkbox');

//     for (var checkbox of checkboxes) {
//         checkbox.addEventListener('click', function () {
//             if (this.checked == true) {
//                 listArray.push(this.value);
//             }
//             else {
//                 listArray = listArray.filter(e => e !== this.value);
//             }
//         })
//     }
// }