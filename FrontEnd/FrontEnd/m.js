let categories = new Set(["Tous"]);

//Au chargement de la page (événement "DOMContentLoaded"), le code effectue une requête à une API qui renvoie une liste .  stockées dans une variable appelée "works".
document.addEventListener('DOMContentLoaded', async () => {
  const works = await (await fetch('http://[::1]:5678/api/works')).json();
//  récupérée de l'API, ajoute la catégorie de l'œuvre au Set "categories", et ajoute le code HTML 
  let galleryHTML = '';
  for (const work of works) {
    categories.add(work.category.name);
    galleryHTML += `<figure>
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>
    </figure>`;
  }
  document.querySelector('.gallery').innerHTML = galleryHTML;
  
// crée des boutons pour chaque catégorie unique stockée dans le Set "categories"
  const creationBtn = (classe, texte) => {
    const sectionFiches = document.getElementById("theBtn");
    const btn = document.createElement("div");
    btn.classList.add(classe);
    btn.innerHTML = texte;
    sectionFiches.appendChild(btn);
  };
  
  // creation des boutons  selon le category.name
  for (const category of categories) {
    if (category === "Tous") {
      creationBtn("btnTous", category);
    } else if (category === "Objets") {
      creationBtn("btnObjet", category);
    } else if (category === "Appartements") {
      creationBtn("btnAppartements", category);
    } else if (category === "Hotels & restaurants") {
      creationBtn("btnHôtels", category);
    }
  }

  const monElements = document.querySelectorAll('.btnTous, .btnObjet, .btnAppartements, .btnHôtels');
// Ajoute un écouteur d'événement pour chaque bouton et filtre les œuvres en fonction de la catégorie sélectionnée, puis met à jour la galerie en n'affichant que les œuvres filtrées.
  monElements.forEach(element => {
    element.addEventListener('click', async (event) => {
      const categoryId = [...categories].indexOf(element.textContent);
      const works = await (await fetch('http://localhost:5678/api/works')).json();
      const filteredWorks = categoryId === 0 ? works : works.filter(work => work.categoryId === categoryId);
      let galleryHTML = '';
      for (const work of filteredWorks) {
        galleryHTML += `<figure>
          <img src="${work.imageUrl}" alt="${work.title}">
          <figcaption>${work.title}</figcaption>
        </figure>`;
      }
      document.querySelector('.gallery').innerHTML = galleryHTML;
    });
  });
});

/*l'authentification des utilisateurs, vérifie s'il existe un token dans le stockage local, change le texte du bouton de connexion en fonction de
 cela et permet à l'utilisateur de se connecter ou de se déconnecter*/
const login = document.querySelector('li:nth-child(3)');
if (localStorage.getItem('token')) {
  login.innerHTML = 'Logout';
}

login.addEventListener('click', (e) => {
  e.preventDefault();
  if (localStorage.getItem('token')) {
    localStorage.removeItem('token');
    login.innerHTML = 'Login';
  } else {
    window.location.href = './login.html';
  }
});
