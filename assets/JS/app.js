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
        //console.log(inputTitle.value);
       // console.log(inputAuthor.value);
        searchBook();
      }
     );
  }


async function searchBook(){
  book.title = inputTitle.value;
  book.author = inputAuthor.value;

  const url="https://www.googleapis.com/books/v1/volumes?AIzaSyBPzxg5cRwtZ9C-dyJqIAegQIHhngSHPdQ&q="+ book.title+ "" + book.author;
  const bookList = await fetch(url).then((response) => response.json());
  
 // console.log(bookList);

  const outputList = document.querySelector("#content");
  const container =
    `<div id="search_container">
    <h2>Résultat de recherche</h2>
    
    <div id="searchResults" ? >
      <ul id="book_list" class="book_list">
      </ul>
      </div>
    `;

    outputList.insertAdjacentHTML('afterbegin',container);

  for(const book of bookList.items){
    renderBook(book)
  }

}


function addElement() {
var element = document.createElement('li');
element.classList.add("book_item");
var parent = document.getElementById('book_list');
parent.insertAdjacentHTML('afterbegin', element);
}


function renderBook(book) {
  const elementBook = document.createElement('li');
  elementBook.classList.add('card');
  var placeHldr = document.createElement('img');
  
  //je crée la variable qui va contenir l'image par defaut ici
  placeHldr.setAttribute("src", "/assets/img/unavailable.png");
  console.log("ici mon placeholer  :" + placeHldr.src)
  var bookCover = book.volumeInfo?.imageLinks?.thumbnail ? book.volumeInfo.imageLinks.thumbnail : placeHldr.src;
  console.log("Mon book Cover ici : "+ bookCover);
  var desc = "Information manquante";
  var author = "auteur non renseigné";
  console.log(book);

  var description = book.volumeInfo?.description? book.volumeInfo.description : desc;
  var authors = book.volumeInfo?.authors? book.volumeInfo.authors : author;
  elementBook.insertAdjacentHTML('beforeend', `
  <div class="book_details">
  <h3 class="book_title">${book.volumeInfo.title}</h3>
  <p class="book_author">${authors}</p>
  <p class="book_id"> Id : ${book.id}</p>
  <i class="fa-solid fa-bookmark"></i>
  </div>
  <img class="book_cover"src="${bookCover}" alt="book cover">
  <div class="overlay">
  <span class="book_description">${description}</span>
  
  </div>
  `);
    var parent = document.getElementById('book_list');
    parent.insertAdjacentElement('beforeend', elementBook);

  // container = document.getElementById('serach_container');
  //  container.insertAdjacentElement('beforeend',parent);
    
  
  }
 
  

searchBookBtn.addEventListener('submit', searchBook);