import { creatures } from "./data.js";
// =============================================================
// script.js — Mon Dex
// =============================================================
// Les données viennent de data.js (la constante `creatures`).
// Écrivez votre code ici, fonctionnalité par fonctionnalité.
// Une carte GitHub Projects et au moins un commit par fonctionnalité.

// the localStorage section
const storage=JSON.parse(localStorage.getItem("creature")) || []
storage.forEach(function(c){
  creatures.push(c)
})

// 1. AFFICHAGE

function affich(list = creatures) {
  const container = document.querySelector("#grid");
  container.innerHTML = list
    .map(
      (creature) => `
    <article data-id="${creature.id}" class="cursor-pointer flex flex-col gap-3 rounded-card bg-ground border-4 border-brand-light p-3 pb-4 transition duration-300 hover:-translate-y-2 shadow-[0_0_30px_rgba(250,204,21,0.6)] hover:shadow-[0_0_45px_rgba(250,204,21,0.9)]">
      <div class="card-img relative flex h-64 items-center justify-center rounded-xl gbg-brand-light">
        <img class="h-full w-full rounded-xl object-cover" src="${creature.image}" alt="${creature.name}" loading="lazy">
        <span class="absolute left-3 top-2 font-mono font-bold text-sm text-white">${creature.id}</span>
      </div>

      <div class="flex items-center flex-col gap-2 text-brand-dark">
        <div class="type-img flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-light shadow-[0_0_30px_rgba(250,204,21,0.6)] [&>svg]:h-6 [&>svg]:w-6" aria-hidden="true">
          ${creature.icon}
        </div>
        <h3 class="cre-name font-display text-sm font-bold">${creature.name}</h3>
        <span class="cre-type rounded-full bg-brand-light px-4 py-2 text-sm font-bold text-ink">${creature.type}</span>
      </div>

      <p class="cre-niv text-sm text-muted">${creature.level}</p>
      <button type="button" data-id="${creature.id}" class="btn-add btn-outline bg-brand text-line border-solid border-brand-light mt-auto shadow-[0_0_25px_rgba(250,204,21,0.6)]">Ajouter à l'équipe</button>
    </article>
  `,
    )
    .join("");

  document.querySelector("#creature-count").textContent = creatures.length;
}

affich();

// 2. DÉTAIL

function detail(creature) {
  const max = 5000;
  // const hpPerc = Math.min(100, (creature.stats.hp / max) * 100);
  const attPerc = (creature.stats.attack / max) * 100;
  const defPerc = (creature.stats.defence / max) * 100;

  const detail = document.querySelector("#detail");
  detail.classList.remove("hidden");
  detail.innerHTML = "";

  detail.innerHTML = `
        <section  aria-label="Détail de la créature" class="flex flex-col gap-4 rounded-card border-4 border-brand-light bg-ground p-4 md:p-6 "style="box-shadow: 0 0 30px rgba(250, 204, 21, 0.6);">  
          <div class="flex items-center justify-between">
            <span class="font-mono text-sm text-muted">${creature.id} · Détail</span>
            <button type="button" aria-label="Fermer le détail" class="btn-close btn-outline w-11 px-0">✕</button>
          </div>
          <div class="flex h-64 items-center justify-center rounded-2xl bg-brand-light">
            <img src="${creature.image}" alt="${creature.name}" class="h-full w-full rounded-2xl object-cover">
          </div>
          <div class="flex flex-wrap justify-between">
            <h2 class="font-display text-3xl font-extrabold text-brand">${creature.name}</h2>
            <span class="rounded-full bg-brand-light px-3 py-1 text-sm font-bold">${creature.type}</span>
          </div>
          <p class="text-cream">${creature.description}</p>
          <div class="flex flex-col gap-2 text-sm text-cream">
            <div class="grid grid-cols-[80px_1fr_40px] items-center gap-2"><span class="font-bold">Attaque</span><span class="h-3 rounded-full bg-ground"><span class="block h-3 rounded-full bg-brand" style="width: ${attPerc}%"></span></span><span class="text-right font-mono">${creature.stats.attack}</span></div>
            <div class="grid grid-cols-[80px_1fr_40px] items-center gap-2"><span class="font-bold">Défense</span><span class="h-3 rounded-full bg-ground"><span class="block h-3 rounded-full bg-brand" style="width: ${defPerc}%"></span></span><span class="text-right font-mono">${creature.stats.defence}</span></div>
          </div>
          <button type="button" class="btn-primary text-line border-2 border-brand-light"style="box-shadow: 0 0 30px rgba(250, 204, 21, 0.6);">Ajouter à l'équipe</button>
        </section>


    `;
}

// event listners
// event listner for the cards
const grid = document.querySelector("#grid");

grid.addEventListener("click", (e) => {
  const card = e.target.closest("article");
  if (!card) return;

  const id = card.dataset.id;
  creatures.forEach((creature) => {
    if (creature.id === id) {
      detail(creature);
    }
  });
});

// event listner fo the close button
const detailPanel = document.querySelector("#detail");

detailPanel.addEventListener("click", (e) => {
  if (e.target.closest(".btn-close")) {
    detailPanel.classList.add("hidden");
  }
});

// 3. RECHERCHE AND FILTER

const rech = document.querySelector("#search");
const tpSelect = document.querySelector("#typeFilter");

function searchFilter() {
  const text = rech.value.toLowerCase().trim();
  const type = tpSelect.value;

  const res = creatures.filter((creature) => {
    const perName = creature.name.toLowerCase().includes(text);
    const perType = type === "Tous" || creature.type === type;

    return perName && perType;
  });
  affich(res);
}
rech.addEventListener("input", searchFilter);
tpSelect.addEventListener("change", searchFilter);

// -------------------------------------------------------------
// 5. CRÉER UNE CRÉATURE
// Validez chaque champ du formulaire avec une expression régulière
// (voir le tableau du brief). Affichez le message d'erreur sous le
// champ, et n'ajoutez jamais une créature invalide.
// -------------------------------------------------------------

// error display function
function error(id, msg, inputId) {
  const errorEL = document.getElementById(id);
  errorEL.innerHTML = msg;
  errorEL.style.display = "block";
  const input = document.querySelector(inputId);
  input.classList.remove("border-brand-light");
  input.classList.add("border-red-600");
}
// error remove function
function errorRemovale(id, inputId) {
  const errorEL = document.querySelector(id);
  errorEL.textContent = "";
  errorEL.style.display = "none";
  const input = document.querySelector(inputId);
  input.classList.remove("border-red-600");
  input.classList.add("border-brand-light");
}

// id validation
function idValidation() {
  const id = document.querySelector("#id").value.trim();
  errorRemovale("#idError", "#id");
  const regex = /^#\d{3}$/;

  if (id === "") {
    error("idError", "id required", "#id");
    return false;
  }
  if (!regex.test(id)) {
    error("idError", "the id should be a # followed by 3 numbers", "#id");
    return false;
  }
  for(let i=0;i<creatures.length;i++){
    if(creatures[i].id === id){
      error("idError", "this id already exist", "#id")
      return false
    }
  }

  return true;
}

// name validation
function nameValidation() {
  const name = document.querySelector("#name").value.trim();
  errorRemovale("#nameError", "#name");

  if (name === "") {
    error("nameError", "name is required", "#name");
    return false;
  }
  if (name.length <= 2) {
    error("nameError", "name should be at least 3 letters", "#name");
    return false;
  }

  return true;
}

// attack validation
function attackValidation() {
  const attack = document.querySelector("#attack").value.trim();
  errorRemovale("#attackError", "#attack");

  if (attack === "") {
    error("attackError", "stats is required", "#attack");
    return false;
  }
  if (isNaN(attack)) {
    error("attackError", "stats should be a number", "#attack");
    return false;
  }
  if (Number(attack) > 5000) {
    error("attackError", "the max stats is 5000", "#attack");
    return false;
  }
  if (Number(attack) < 0 ) {
    error("attackError", "the  stats should be positive ", "#attack");
    return false;
  }

  return true;
}

// defence validation
function defenceValidation() {
  const defence = document.querySelector("#defence").value.trim();
  errorRemovale("#defenceError", "#defence");

  if (defence === "") {
    error("defenceError", "stats is required", "#defence");
    return false;
  }
  if (isNaN(defence)) {
    error("defenceError", "stats should be a number");
    return false;
  }
  if (Number(defence) > 5000) {
    error("defenceError", "the max stats is 5000", "#defence");
    return false;
  }
  if (Number(defence) < 0 ) {
    error("defenceError", "the stat should be positive ", "#defence");
    return false;
  }
  return true;
}

// img validation
function imgValidation() {
  const img = document.querySelector("#img").value.trim();
  errorRemovale("#imgError", "#img");

  const regexImg =/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|avif|bmp|svg)(\?.*)?$/i;
  if (img === "") {
    error("imgError", "image required", "#img");
    return false;
  } else if (!regexImg.test(img)) {
    error("imgError", "this is not a valid image url", "#img");
    return false;
  }
  return true;
}

// description validation
function descriptionValidation() {
  const description = document.querySelector("#description").value.trim();
  errorRemovale("#descriptionError", "#description");

  if (description === "") {
    error("descriptionError", "description is required", "#description");
    return false;
  }
  if (description.length <= 9) {
    error(
      "descriptionError",
      "description should be at least 10 letters",
      "#description",
    );
    return false;
  }

  return true;
}
// level validation
function levelValidation() {
  const level = document.querySelector("#level").value.trim();
  errorRemovale("#levelError", "#level");

  if (level === "") {
    error("levelError", "stats is required", "#level");
    return false;
  }
  if (Number(level) > 12) {
    error("levelError", "the max level is 12", "#level");
    return false;
  }
  return true;
}

function formValidation() {
  const form = document.querySelector("#creature-form");
  // real time check
  form.addEventListener("input", function (e) {
    const field = e.target.id;

    if (field === "id") idValidation();
    if (field === "name") nameValidation();
    if (field === "attack") attackValidation();
    if (field === "defence") defenceValidation();
    if (field === "img") imgValidation();
    if (field === "description") descriptionValidation();
    if (field === "level") levelValidation();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

      const idOk = idValidation() 
      const nameOk = nameValidation() 
      const attackOk = attackValidation() 
      const defenceOk = defenceValidation() 
      const imgOk = imgValidation() 
      const levelOk = levelValidation() 
      const descriptionOk = descriptionValidation() 

    if (idOk && nameOk && attackOk && defenceOk && imgOk && levelOk && descriptionOk ) {
      // alert("the form is submitted");
      const newCreature={
              id: document.querySelector("#id").value.trim(),
      name: document.querySelector("#name").value.trim(),
      type: document.querySelector("#type").value,
      level: document.querySelector("#level").value.trim(),
      image: document.querySelector("#img").value.trim(),
      description: document.querySelector("#description").value.trim(),
      icon: "",
      stats: {

        attack: Number(document.querySelector("#attack").value),
        defence: Number(document.querySelector("#defence").value),
      },
      }
      creatures.push(newCreature)
    }
  });
}
formValidation();

// -------------------------------------------------------------
// 6. MON ÉQUIPE
// Boutons « Ajouter à l'équipe » et « Retirer », gérés avec UN SEUL
// écouteur sur la grille et UN SEUL sur l'équipe (délégation).
// -------------------------------------------------------------

// -------------------------------------------------------------
// 7. RÈGLES DE L'ÉQUIPE
// 6 créatures au maximum, pas de doublon, un message clair quand
// une action est refusée, et un compteur (x/6).
// -------------------------------------------------------------

// -------------------------------------------------------------
// BONUS : LocalStorage, Fetch API, tri, comparaison
// -------------------------------------------------------------
