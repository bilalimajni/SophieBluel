

/*récupérer des données à partir d'une URL qui renvoie des informations sur des œuvres. 
Une fois que les données ont été récupérées, le code génère des éléments HTML pour afficher les images et les titres des œuvres dans une galerie.*/

let categoryNames = [];
document.addEventListener('DOMContentLoaded', async (e) => {
  e.preventDefault();
  const works = await (await fetch('http://[::1]:5678/api/works')).json();
  const categories = new Set(["Tous", ...Array.from(new Set(works.map(work => work.category.name)))]);
  
  // Récupération des noms de catégories
categoryNames = Array.from(categories);

  let galleryHTML = '';
  for (const work of works) {
    galleryHTML += `<figure>
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>
    </figure>`;
  }
  document.querySelector('.gallery').innerHTML = galleryHTML;

  //* création des boutons de filtre
  const creationBtn = (classe, texte) => {
    const sectionFiches = document.getElementById("theBtn");
    const btn = document.createElement("div");
    btn.classList.add(classe);
    btn.innerHTML = texte;
    sectionFiches.appendChild(btn);
  };

  for (const category of categories) {
    if (category === "Tous") {
      creationBtn("btnTous", category);
    } else if (category === "Objets") {
      creationBtn("btnObjet", category);
    } else if (category === "Appartements") {
      creationBtn("btnAppartements", category);
    } else if (category === "Hotels & restaurants") {
      creationBtn("btnHotels", category);
    }
  }
 /* des écouteurs d'événements pour les boutons de filtre de catégorie, qui permettent de mettre à jour dynamiquement
   la galerie d'œuvres affichées en fonction de la catégorie sélectionnée par l'utilisateu*/

  const monElements = document.querySelectorAll('.btnTous, .btnObjet, .btnAppartements, .btnHotels');

  monElements.forEach(element => {
    element.addEventListener('click', async (event) => {
      event.preventDefault();
      const categoryId = categoryNames.indexOf(element.textContent);
      const filteredWorks = categoryId === 0 ? works : works.filter(work => work.category.name === element.textContent);
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







//* login
const login = document.querySelector('li:nth-child(3)');
const mesprojets = document.querySelector('.titleIconModifier');

/*Ce code modifie le contenu de certains éléments HTML et insère des éléments supplémentaires dans la page pour permettre à l'utilisateur de modifier et publier des changements, 
mais seulement si un jeton d'authentification est trouvé dans le stockage local du navigateur*/
if (localStorage.getItem('token')) {
  login.innerHTML = 'Logout';
  mesprojets.innerHTML = ' <div class="e"> <h2>Mes Projets</h2> <div> <div class="blocModfierGallery"> <div  class="margin"><i class="fa-regular fa-pen-to-square"></i></div>modifier</div></div> </div>';

  const htmlAdd = '<div class="navEdition">' +
  '<div class="edition">' +
  '<i class="fa-regular fa-pen-to-square"></i>' +
      '<p>Mode édition</p>' +
  '</div>' +
   
  '<div class="publierChangemant">' +
  '<p>publier les changements</p>' +
  '</div>' +
  '</div>';

  const imageModifierElement = document.querySelector('.imagemodifier');
  imageModifierElement.insertAdjacentHTML('beforeend', '<div class="blocModfierGallery1"> <div class="margin"><i class="fa-regular fa-pen-to-square"></i></div><p>modifier</p></div></div> </div>');

  const articleModifierElement = document.querySelector('.articleModifier');
  articleModifierElement.insertAdjacentHTML('afterbegin', '<div class="blocModfierGallery2"> <div class="margin"><i class="fa-regular fa-pen-to-square"></i></div>modifier</div></div> </div>');

  // Insérer le HTML au début de la page
  const body = document.querySelector('body');
  body.insertAdjacentHTML('afterbegin', htmlAdd);

    const header = document.querySelector('header'); // Changez 'header' en fonction de votre sélecteur
    header.style.margin = '100px';

  

 
}
/* gère la connexion et la déconnexion des utilisateurs, ainsi que l'apparence de la page en fonction de leur état 
de connexion actuel, en ajoutant un écouteur d'événements sur l'élément "login".*/

login.addEventListener('click', (e) => {
  e.preventDefault();
  if (login.innerHTML === 'Logout') {
    login.innerHTML = 'Login';
    
    mesprojets.innerHTML = '';
    
    


    const imageModifierElement = document.querySelector('.imagemodifier');
    if (imageModifierElement) {
      imageModifierElement.innerHTML = '';
    }

    const articleModifierElement = document.querySelector('.articleModifier');
    if (articleModifierElement) {
      articleModifierElement.innerHTML = '';
    }

    // Supprimer le contenu ajouté précédemment au début de la page
    const navEditionElement = document.querySelector('.navEdition');
    if (navEditionElement) {
      navEditionElement.remove();
    }

    // Mettre à jour le localStorage pour refléter que l'utilisateur est déconnecté
   
  }


  if (localStorage.getItem('token')) {
    
    localStorage.removeItem('token');
    login.innerHTML = 'Login';
    const header = document.querySelector('header'); // Changez 'header' en fonction de votre sélecteur
    header.style.margin = '30px';
   
    
    mesprojets.innerHTML = '';
  } else {
    window.location.href = './login.html';
    
  }
});









//
// Fonction pour récupérer les données de l'API
async function fetchWorksData() {
  const response = await fetch('http://127.0.0.1:5678/api/works');
  const works = await response.json();
  return works;
}
/*supprime une œuvre d'art de la base de données en envoyant une requête DELETE à l'API, puis met à jour la galerie principale et la mini-galerie en conséquence.*/
let deletedWorks = localStorage.getItem('deletedWorks') ? Array.from(new Set(JSON.parse(localStorage.getItem('deletedWorks')))) : [];

async function deleteWork(id, workElement, minigallery) {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const response = await fetch(`http://127.0.0.1:5678/api/works/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'userId': userId,
      'Cache-Control': 'no-cache'
    }
  });

  if (response.status === 200) {
    if (workElement) {
      const galleryElement = document.querySelector(`.gallery figure[data-id="${id}"]`);
      if (galleryElement) {
        galleryElement.remove();
      }
      workElement.remove();
    }
    // Ajouter l'ID supprimé à la liste des deletedWorks
    deletedWorks.push(id);
    localStorage.setItem('deletedWorks', JSON.stringify(Array.from(new Set(deletedWorks))));
    refreshMainGallery(); // mettre à jour la galerie principale
    refreshMiniGallery(await fetchWorksData(), deletedWorks, minigallery); // mettre à jour la mini-galerie
    return true;
  }
  return false;
}

/* crée un élément de galerie d'œuvres à partir des données fournies, en excluant les œuvres supprimées, puis retourne le code HTML résultant. 
Elle peut également ajouter des icônes d'édition et de suppression si l'argument "mini" est vrai.*/
function generateGalleryHTML(works, deletedWorks, mini = false) {
  const gallery = document.createElement('div');

  for (const work of works) {
    if (!deletedWorks.includes(work.id)) {
      const figure = document.createElement('figure');
      figure.setAttribute('data-id', work.id);

      const img = document.createElement('img');
      img.src = work.imageUrl;
      img.alt = work.title;
      figure.appendChild(img);

      if (mini) {
        const galleryIcon = document.createElement('div');
        galleryIcon.classList.add('gallery-icon');
        figure.appendChild(galleryIcon);

        const iconSupprimer = document.createElement('i');
        iconSupprimer.classList.add('fa-solid', 'fa-trash-can', 'iconSupprimer');
        galleryIcon.appendChild(iconSupprimer);

        const iconMove = document.createElement('i'); // Ajouter l'icône de flèches
        iconMove.classList.add('fa-solid', 'fa-arrows-up-down-left-right', 'iconMove');
        galleryIcon.appendChild(iconMove);

        const figcaption = document.createElement('figcaption');
        figcaption.textContent = 'éditer';
        figure.appendChild(figcaption);
      } 

      gallery.appendChild(figure);
    }
  }

  return gallery.innerHTML;
}


/*crée et retourne  minigallery  élément de galerie miniature en utilisant le code HTML fourni.*/
function createMiniGallery(galleryHTML) {
  const minigallery = document.createElement('div');
  minigallery.classList.add('minigallery');
  minigallery.innerHTML = galleryHTML;
  return minigallery;
}
/*ctualise le code HTML de la galerie miniature avec les nouvelles données fournies, en utilisant la fonction generateGalleryHTML(), 
mais ne modifie pas l'élément existant ni ne retourne de nouveau code HTML.*/
function refreshMiniGallery(works, deletedWorks, minigallery) {
  
  const galleryHTML = generateGalleryHTML(works, deletedWorks);
  
 
}

/* ferme une fenêtre modale en masquant son conteneur et en réinitialisant la couleur de fond de la page.*/
function closeModal(modalContainer) {
  modalContainer.style.display = 'none';
  document.body.style.backgroundColor = '';

}
/*actualise l'élément ".gallery" de la galerie principale en mettant à jour son contenu HTML avec le nouveau code HTML généré à partir des données des œuvres récupérées.*/
function refreshMainGallery() {
  const galleryElement = document.querySelector('.gallery');
  if (galleryElement) {
    fetchWorksData().then((works) => {
      const galleryHTML = generateGalleryHTML(works, deletedWorks);
      galleryElement.innerHTML = galleryHTML;
    });
  }
}

/*ajoute des écouteurs d'événements aux icônes de suppression dans la galerie miniature, récupère l'ID correspondant et appelle deleteWork()
 pour supprimer l'œuvre de la base de données, actualise ensuite la galerie principale et la galerie miniature avec les données mises à jour. 
 Elle réinitialise enfin les écouteurs d'événements pour les icônes.*/

let modalContainer = null;
let eventBound = false;
function bindIconEvents(minigallery) {
const minifigures = minigallery.querySelectorAll('figure');
minifigures.forEach(minifigure => {
const deleteIcon = minifigure.querySelector('.gallery-icon .fa-trash-can');
deleteIcon.addEventListener('click', async (e) => {
  e.preventDefault();
  e.stopPropagation();
  const id = minifigure.getAttribute('data-id');
  const deleteSuccess = await deleteWork(id, minifigure, minigallery, deletedWorks); 
  if (deleteSuccess) {
    refreshMainGallery();
    refreshMiniGallery(await fetchWorksData(), deletedWorks, minigallery); // Ajouter await fetchWorksData() et deletedWorks à l'appel de la fonction refreshMiniGallery
    bindIconEvents(minigallery); // Réinitialiser les écouteurs d'événements après la mise à jour
  }
});
});
}
/*crée une modale affichant une galerie miniature avec des icônes de suppression et d'édition pour chaque œuvre. Elle gère également les clics sur les icônes de suppression pour
 supprimer les œuvres correspondantes de la base de données et actualiser les galeries principale et miniature*/
async function displayModal(galleryElement) {
  const modifierModal = document.querySelector('.blocModfierGallery');
  const works = await fetchWorksData();
  const galleryHTML = generateGalleryHTML(works, deletedWorks, true);
  const minigallery = createMiniGallery(galleryHTML);

  if (!eventBound) {
    modifierModal.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!modalContainer) {
        modalContainer = createModal(minigallery);
        document.body.appendChild(modalContainer);
      } else {
        modalContainer.style.display = 'block';
      }
      document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    });
    eventBound = true;
  }

  minigallery.addEventListener('click', async (e) => {
    const deleteIcon = e.target.closest('.fa-trash-can');
    if (deleteIcon) {
      e.preventDefault();
      e.stopPropagation();
      const minifigure = deleteIcon.closest('figure');
      const id = minifigure.getAttribute('data-id');
      const deleteSuccess = await deleteWork(id, minifigure, minigallery, deletedWorks);
      if (deleteSuccess) {
        refreshMainGallery();
        refreshMiniGallery(await fetchWorksData(), deletedWorks, minigallery);
        bindIconEvents(minigallery);
      }
    }
  });
  

  bindIconEvents(minigallery);
  
}

function initializeModalEvents(modalContent, modalContainer) {
const form = modalContent.querySelector('form');
form.addEventListener('submit', (e) => handleSubmit(e, form, modalContainer));

const closeButton = modalContent.querySelector('.iconCloasePrmireModale');
closeButton.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target === modalContainer) {
    closeModal(modalContainer);
  }
  closeModal(modalContainer);
});
}

function resetModalContent(modalContent, modalContainer) {
modalContent.innerHTML = previousModalContent;
initializeModalEvents(modalContent, modalContainer);

const minifigures = modalContainer.querySelectorAll('.miniGallery figure');
minifigures.forEach(minifigure => {
  const deleteIcon = minifigure.querySelector('.gallery-icon .fa-trash-can');

  deleteIcon.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const id = minifigure.getAttribute('data-id');
    const deleteSuccess = await deleteWork(id);

    if (deleteSuccess) {
      minifigure.remove();
      const minigallery = modalContainer.querySelector('.miniGallery');
      refreshMiniGallery(minigallery, await fetchWorksData(), deletedWorks);
      refreshMainGallery() ;
      
    }
  });
});


}

/*crée un élément de conteneur pour une modale qui contient une galerie photo et un formulaire pour ajouter des photos, ainsi qu'une option pour supprimer la galerie. 
Elle ajoute également des écouteurs d'événements pour les icônes de suppression et pour fermer la modale.*/
function createModal(minigallery) {
const modalContainer = document.createElement('div');
modalContainer.classList.add('modal-dialog');
modalContainer.setAttribute('aria-hidden', 'true');
modalContainer.setAttribute('role', 'dialog');

modalContainer.innerHTML = `
<div class="modal-content" data-state="first">
    <div class="iconCloasePrmireModale"><i class="fa-solid fa-xmark"></i></div>
    <h2>Galerie photo</h2>
    <div class="miniGallery">
    ${minigallery.innerHTML}
  </div>
  <form action="#" method="post" id="myForm">
    <input type="submit" value="Ajouter une photo" class="envoyerModal">
  </form>
  <div class="trait"></div>
  <p>Supprimer la galerie</p>
</div>
`;

const modalContent = modalContainer.querySelector('.modal-content');
initializeModalEvents(modalContent, modalContainer);

const minifigures = modalContainer.querySelectorAll('.miniGallery figure');
minifigures.forEach(minifigure => {
  const deleteIcon = minifigure.querySelector('.gallery-icon .fa-trash-can');

  deleteIcon.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const id = minifigure.getAttribute('data-id');
    const deleteSuccess = await deleteWork(id, minifigure);
    if (deleteSuccess) {
      minifigure.remove();
      refreshMainGallery(); 
      refreshMiniGallery(minigallery,  deletedWorks);
    }
  });
});
 

document.body.addEventListener('click', (e) => {
  if (
    e.target.closest('.modal-dialog') === null &&
    e.target.closest('.blocModfierGallery') === null &&
    modalContainer.style.display !== 'none'
  ) {
    closeModal(modalContainer);
  }
});


return modalContainer;

}


window.addEventListener('DOMContentLoaded', () => {
const galleryElement = document.querySelector('.gallery');
displayModal(galleryElement);
});




















// Appel de la fonction d'affichage de la modale au chargement du DOM

  displayModal();


     








