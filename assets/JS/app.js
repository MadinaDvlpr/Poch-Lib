const btnAdd = document.createElement('button');
btnAdd.innerHTML = "Ajouter un Livre";
btnAdd.classList.add('myBtn');
var content = document.querySelector('#content');
var deleteBtn = document.createElement("button");
var searchBookBtn = document.createElement("button");
var inputTitle = document.createElement("input");
var inputAuthor = document.createElement("input");
searchBookBtn.addEventListener('submit', searchBook);
var book ={
  title : "",
  author : "",
  id :"",
  description:"",
  img: ""
};
var bookList =[];
const container =
    `<div id="search_container">
    <h2>Résultat de recherche</h2>
    
    <div id="search_results" ? >
      <ul id="book_list" class="book_list">
      </ul>
      </div>
    `;
content.appendChild(btnAdd);
btnAdd.addEventListener('click', showSearchBookForm);
const elementBook = document.createElement('li');
elementBook.classList.add('card');
var renderDiv;
function showSearchBookForm() {
    // retrait du bouton ajouter un livre
    btnAdd.classList.add('hidden');
 // Création de la div search results
 var searchContainer = document.createElement("div");
 searchContainer.id ='search_container';
 searchContainer.classList.add('hidden');
    //création de la div pour le formulaire
    const formSection = addElement(parent, "div", {
      class:"modal",
      innerHTML: "Rechercher un livre",
    });
    //création de la div pour les resultats de recherche
    
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
    inputAuthor.id ='author';


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
    formSection.insertAdjacentHTML('beforebegin', container);
   
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
  const outputList = document.querySelector("#content");
  outputList.innerHTML="";
  book.title = inputTitle.value;
  book.author = inputAuthor.value;

  const url="https://www.googleapis.com/books/v1/volumes?AIzaSyBPzxg5cRwtZ9C-dyJqIAegQIHhngSHPdQ&q="+ book.title+ "" + book.author;
  bookList = await fetch(url).then((response) => response.json());
  
 // console.log(bookList);

  
  

    outputList.insertAdjacentHTML('beforeend',container);
    if (bookList.totalItems > 0) {
  for(const book of bookList.items){
    renderBook(book)
  }} else {
    var noResult = document.createElement('div');
    noResult.innerHTML= "Aucun livre n'a été trouvé";
    outputList.insertAdjacentElement('beforeend',noResult)
    };
    showSearchBookForm();
  }





function clearElements(){
  const outputList = document.querySelector("#search_results");
  outputList.innerHTML ="";
}

function addElement(parent,tag, attributes){
  var element = document.createElement(tag);
  // pour affecter des attributs au nouvel élément àcrée
  //The Object.keys() static method returns an array of a given object's own enumerable string-keyed property names.
  for (key of Object.keys(attributes)) {
    element[key] = attributes[key];
}
// pour ajouter l'élément crée dans son parent 
var parent = renderDiv || document.getElementById('content');
  parent.appendChild(element);
 // element.appendTo(parent);
  return element;
}
function createBook(book){
  var placeHldr = document.createElement('img');
  
  //je crée la variable qui va contenir l'image par defaut ici
  placeHldr.setAttribute("src", "/assets/img/unavailable.png");
  var bookCover = book.volumeInfo?.imageLinks?.thumbnail ? book.volumeInfo.imageLinks.thumbnail : placeHldr.src;
  var desc = "Information manquante";
  var author = "auteur non renseigné";
  var description = book.volumeInfo?.description? book.volumeInfo.description : desc;
  var authors = book.volumeInfo?.authors? book.volumeInfo.authors : author;
  var bookTitle = book.volumeInfo?.title? book.volumeInfo.title : book.title;
  elementBook.insertAdjacentHTML('beforeend', `
  
  <div class="book_details" style="background-image: url('${bookCover}');">
  <div class="book_header">
     <h3 class="book_title">${bookTitle}</h3>
     <p class="book_author">${authors}</p>
     <p class="book_id"> Id : ${book.id}</p>
             <i id="bookmark_${book.id}" class="fa-solid fa-bookmark bookmark" ></i>
  </div>
       
      
        <div class="overlay">
           <span class="book_description">${description}</span>
       </div>
  `);
  var parent = renderDiv|| document.getElementById('book_list'); //container si rien booklist sinon le @
    parent.insertAdjacentElement('beforeend', elementBook);
    return parent;
}
function renderBook(book,renderDiv) {
 createBook(book);
    document.getElementById(`bookmark_${book.id}`).addEventListener('click', ()=> addToPochlist(book));
  }

function addToPochlist(book, checkIfExisting){
  console.log("dans addtopchl "+ JSON.stringify(book.id));
  console.log("dans addtopch2 "+ book.id);

  document.getElementById(`bookmark_${book.id}`).style.color = "red";
  console.log(document.getElementById(`bookmark_${book.id}`));
 // createBook(JSON.stringify(book));
 
 console.log('ajouté à la poche liste : '+ book.volumeInfo.title);
 

 //1. recup session storage 
 var bookInStorage = sessionStorage.getItem("pochlist");
 var bookExists = false;

 if (checkIfExisting) {
  
   if (bookInStorage) {
     const booksInSession = bookInStorage.split("|");
     const existingBooksInSession = booksInSession.filter(
       (currentBookJsonEncoded) =>
         (JSON.parse(currentBookJsonEncoded) || {}).id === book.id
     );
     if (existingBooksInSession.length) {
       // Vérifier que book pas déjà dans session
       bookExists = true;
     }
   }
 }
    
  // Si pas déjà présent ==> ajouter au SS
  if (!bookExists) {
    // Ajouter au session storage
    const bookData = JSON.stringify(book);
    if (bookInStorage) {
      bookInStorage += bookData;
    } else {
      bookInStorage = bookData;
    }
//on crée un session storage' si existe pas et on y met le book
    sessionStorage.setItem("pochlist", bookInStorage);
  }
  bookInStorage = sessionStorage.getItem("pochlist");
 // bookInStorage.forEach(book => {
createBook(book);

 // });    
 console.log('la poche liste : '+ JSON.stringify(bookInStorage));          
}
//recup livre envoyer dans pochlist
//pochlist = session storage

//2.boucler sur pochlist et voir si le livre existe deja dans pochlist si oui on msg "livre deja ajouté"
//3. ajouter le book dans [] et le renvoyer 
    
    
    
function getPochlistFromStorage() {
  const pochlist = sessionStorage.getItem("pochlist");
  if (pochlist) {
    // Si des livres sont présents dans la session storage
    // Format "bookID1, bookID2"
    const myPochList = pochlist.split("|");

    // Charger la poch list
    for (const bookStored of myPochList) {
      if (bookStored) {
        const bookParse = JSON.parse(bookStored);
        addToPochlist(bookParse, true);
      }
    }
  }
}
  
  
    
         
    
    
    



const panels = document.querySelectorAll('.panel');

panels.forEach(panel => {
    panel.addEventListener('click', () => {
        removeActiveClasses();
        panel.classList.add('active');
    })
})

function removeActiveClasses(){
    panels.forEach(panel => {
        panel.classList.remove('active');
    })
}