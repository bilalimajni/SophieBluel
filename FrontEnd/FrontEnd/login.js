

//creation un élément header avec un titre h1 contenant le nom de l'architecte
const header = document.createElement("header");
header.innerHTML += "<h1>Sophie Bluel <span>Architecte d'intérieur</span></h1>";
document.body.appendChild(header);

//La fonction nav crée un élément nav avec une liste contenant plusieurs éléments li Elle ajoute ensuite cet élément nav à l'élément header
const nav = () => {
  const nav = document.createElement("nav");
  nav.innerHTML += `
    <ul>
      <li>projets</li>
      <li>contact</li>
      <li>login</li>
      <li><img src="./assets/icons/instagram.png" alt="Instagram"></li>
    </ul>
  `;
  header.appendChild(nav);
};
nav();

/*La fonction sectionContact crée un élément section , ajoute un titre h2 et un formulaire avec
 deux champs input pour l'adresse e-mail et le mot de passe grace ou innerHTML ,creatElement permet de crée un element, appendChild permet de l'ajauter*/

const sectionContact = () => {
  const sectionContact = document.createElement("section");
  sectionContact.id = "contact";
  sectionContact.innerHTML += `
    <h2>Contact</h2>
    <form action="#" method="post">
  
    <label for="email">Email</label>
    <input type="email" name="email" id="email">
    <label for="password">password</label>
    <input type="password" name="password" id="password">


    <input type="submit" value="Envoyer">
</form>
    <div id="error-message"></div>
  `;
  document.body.appendChild(sectionContact);

  /* Le code récupère les valeurs des champs input et envoie une requête POST à une API. Il stocke les informations de l'utilisateur dans le stockage local et redirige
   l'utilisateur vers une autre page si la réponse de l'API est positive,sinon il affiche un message d'erreur dans l'élément div.*/
  const form = sectionContact.querySelector("form");
  const errorMessage = sectionContact.querySelector("#error-message");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("connexion réussie");
          return response.json();
          
        } else {
          throw new Error("Identifiants incorrects");
        }
      })
      .then((FormInscription) => {
        window.localStorage.setItem("userId", FormInscription.userId);
        window.localStorage.setItem("token", FormInscription.token);
        location.href = "./index.html"; 
        
      })
      .catch((error) => {
        errorMessage.textContent = error.message;
      });
  });

};

sectionContact();



if (window.localStorage.getItem("token")) {
  const logoutButton = nav.querySelector("li:nth-child(3)");
  logoutButton.addEventListener("click", () => {
    window.localStorage.removeItem("token");
    location.href = "./index.html";
  });
}

