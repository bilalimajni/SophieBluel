document.addEventListener('DOMContentLoaded', async () => {

        const works = await ( await fetch ('http://[::1]:5678/api/works')).json()
  
        let galleryHTML = ''
        for (const work of works)  {
  
            galleryHTML += `<figure>
                          <img src="${work.imageUrl}" alt="${work.title}">
                   <figcaption>${work.title}</figcaption>
                   </figure>`
        }
       document.querySelector('.gallery').innerHTML = galleryHTML
  })


const categories = ["Tous", "Objets", "Appartements", "Hôtels & restaurants"];

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
  } else if (category === "Hôtels & restaurants") {
    creationBtn("btnHôtels", category);
  }
}

const monElements = document.querySelectorAll('.btnTous , .btnObjet , .btnAppartements , .btnHôtels');

monElements.forEach(element => {
  element.addEventListener('click', async (event) => {
    const categoryId = categories.indexOf(element.textContent);
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
