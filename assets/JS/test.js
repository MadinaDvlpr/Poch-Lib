const btnAdd = document.createElement('button');
btnAdd.innerHTML = "Ajouter un Livre";
btnAdd.classList.add('myBtn');
var content = document.querySelector('#content');
var deleteBtn = document.createElement("button");
var searchBookBtn = document.createElement("button");
var inputTitle = document.createElement("input");
var inputAuthor = document.createElement("input");
var book ={
            title : "",
            author : "",
            id :"",
            description:"",
            img: ""
          };

var bookList =[];
content.appendChild(btnAdd);
btnAdd.addEventListener('click', showSearchBookForm);


function showSearchBookForm() {
    // retrait du bouton ajouter un livre
    btnAdd.classList.add('hidden');

    //création de la div pour le formulaire
    const formSection = document.createElement("div");
    formSection.classList.add('modal');
    formSection.innerHTML = "Rechercher un livre";

    //creation du formulaire
    const form = document.createElement("form")
    form.classList.add('search_form');

    //création de l'input titre du livre
    var labelTitle = document.createElement("label");
    labelTitle.innerHTML = "Titre :";
    inputTitle.setAttribute("type", "text");
    inputTitle.setAttribute("name", "title");
    inputTitle.setAttribute("placeholder", "Titre");
    inputTitle.id ='title';


    //création de l'input auteur du livre
    
    var labelAuthor = document.createElement("label");
    labelAuthor.innerHTML = "Auteur :";
    inputAuthor.setAttribute("type", "text");
    inputAuthor.setAttribute("name", "author");
    inputAuthor.setAttribute("placeholder", "Auteur");
    inputTitle.id ='author';


    // création du bouton de rechérche
    
    searchBookBtn.innerHTML = "Rechercher";
    searchBookBtn.classList.add('myBtn');
    //searchBookBtn.type = "submit";
    searchBookBtn.style.width = "20%";
    
  
    // Création du bouton annuler
   
    deleteBtn.innerHTML = "Annuler";
    deleteBtn.classList.add('myBtn');
    deleteBtn.id = 'cancel';
    deleteBtn.type = "reset";
    deleteBtn.style.width = "20%";

    // Ajouter des divers élements dans le formulaire
    form.appendChild(labelTitle);
    form.appendChild(inputTitle);
    form.appendChild(labelAuthor);
    form.appendChild(inputAuthor);
    form.appendChild(searchBookBtn);
    form.appendChild(deleteBtn);

    // ajout du formulaire à la div
    formSection.appendChild(form);

    // Ajouter de la div dans le document
    content.appendChild(formSection);
    searchBookBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log(inputTitle.value);
        console.log(inputAuthor.value);
        searchBook();
      }
     );
  }


function searchBook(){


book.title = inputTitle.value;
book.author = inputAuthor.value;

var url="https://www.googleapis.com/books/v1/volumes?AIzaSyBPzxg5cRwtZ9C-dyJqIAegQIHhngSHPdQ&q="+ book.title+ "" + book.author;


//appel de l'API Google Books (GET)
//asynchrone pour laisser le temps d'aller chercher les films avant d'exécuter le reste du code sinon pas sde données 
const fetchBooks = async () => {
      bookList = await fetch(url).then((response) => response.json());


    //une fois le resultat obtenu on converti le resulat json
    //const books = await response.json();
    console.log(bookList);
  };
  var displayBookSearch = async () => {
    await fetchBooks();
    addBook();
    console.log("MA FONCTION DISPLAY SEARCH");
  }
  
  var outputList = document.querySelector("#content");
  var container =
    `<div>
    <h2>Résultat de recherche</h2>
    
    <div id="searchResults" ? >
      <ul id="book_list" class="book_list">
      </ul>
      </div>
    `;
    outputList.insertAdjacentHTML('afterbegin',container);
    console.log(outputList);

  

    
  
  fetchBooks();
  displayBookSearch();

}




function addElement() {
  console.log("MA FONCTION ADD ELEMENT");
var element = document.createElement('li');

var parent = document.getElementById('book_list');
parent.insertAdjacentHTML('afterbegin', element);
}



function addBook() {

  console.log("MA FONCTION ADD BOOK");
  // Créer div pour le book
  const bookID = book.id;
  addElement(parent, "ul", {
    className: "book_list",
    id: bookID,
  });


  // Insérer le titre (dans le conteneur du book)
  addElement(bookID, "p", {
    className: "book_title",
    innerHTML: "Titre: " + book.title,
  });

  // Insérer l'ID (dans le conteneur du book)
  addElement(bookID, "p", {
    className: "book_id",
    innerHTML: "ID: " + book.id,
  });

  // Insérer l'auteur (dans le conteneur du book)
  addElement(bookID, "p", {
    className: "book_author",
    innerHTML: "Auteurs: " + book.author,
  });

  // Insérer la description (dans le conteneur du book)
  addElement(bookID, "p", {
    className: "book-description",
    innerHTML: book.description ? `Description:${book.description}`: "Informations manquantes",
  });

  // Insérer l'image (dans le conteneur du book)
  addElement(bookID, "img", {
    className: "book-image",
    innerHTML: book.imageLinks
      ? "<img width='100' height='100' src='" +
        book.imageLinks.thumbnail +
        "' />"
      : "<img width='100' height='100' src='unavailable.png' />",
  });
}


searchBookBtn.addEventListener('submit', searchBook);
