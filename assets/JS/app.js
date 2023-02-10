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
const searchContainer =
    `<div id="search_container">
    <h3>Résultat de recherche</h3>
    
    <div id="search_results" >
      <ul id="book_list" class="book_list">
      </ul>
    </div>
    </div>
    
    `;
    const pochlistContainer = 
    `
    <div id="pochlist_container">
    <div id="mypochlist" >
      <ul id="pochlist" class="book_list">
      </ul>
    </div>
    </div>
    `
   
    content.insertAdjacentHTML('beforeend', pochlistContainer)
   //searchContainer.classList.add('hidden');
content.appendChild(btnAdd);
btnAdd.addEventListener('click', showSearchBookForm);
var renderDiv;
function showSearchBookForm() {
    // retrait du bouton ajouter un livre
    btnAdd.classList.add('hidden');

// searchContainer.classList.add('hidden');
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
   // formSection.insertAdjacentHTML('beforebegin', pochlistContainer);
   
    // Ajouter de la div dans le document
    content.insertAdjacentElement('afterbegin', formSection);

     //insertion de la div résultats search container 
     formSection.insertAdjacentHTML('beforeend',searchContainer);
    searchBookBtn.addEventListener('click', (e) => {
        e.preventDefault();
        //console.log(inputTitle.value);
       // console.log(inputAuthor.value);
        searchBook();
      }
     );
  }


async function searchBook(){
  const outputList = document.querySelector("#book_list");
  //outputList.innerHTML="";
  book.title = inputTitle.value;
  book.author = inputAuthor.value;

  const url="https://www.googleapis.com/books/v1/volumes?AIzaSyBPzxg5cRwtZ9C-dyJqIAegQIHhngSHPdQ&q="+ book.title+ "" + book.author;
  bookList = await fetch(url).then((response) => response.json());
  
 // console.log(bookList);

  
  

    outputList.insertAdjacentHTML('afterend',searchContainer);
    if (bookList.totalItems > 0) {
  for(const book of bookList.items){
    renderBook(book)
  }} else {
    var noResult = document.createElement('div');
    noResult.innerHTML= "Aucun livre n'a été trouvé";
    outputList.insertAdjacentElement('beforeend',noResult)
    };
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
function createBook(book, renderDiv){
  var placeHldr = document.createElement('img');
  
  //je crée la variable qui va contenir l'image par defaut ici
  placeHldr.setAttribute("src", "/assets/img/unavailable.png");
  var bookCover = book.volumeInfo?.imageLinks?.thumbnail ? book.volumeInfo.imageLinks.thumbnail : placeHldr.src;
  var desc = "Information manquante";
  var author = "auteur non renseigné";
  var description = book.volumeInfo?.description? book.volumeInfo.description : desc;
  description = truncate(description, 200);
  var authors = book.volumeInfo?.authors? book.volumeInfo.authors : author;
  var bookTitle = book.volumeInfo?.title? book.volumeInfo.title : book.title;

  const elementBook = document.createElement('li');
  elementBook.classList.add('card');

  elementBook.insertAdjacentHTML('beforeend', `
  
  <div class="book_header">
  <div class="book_details">
     <h3 class="book_title">${bookTitle}</h3>
     <p class="book_authors">${authors}</p>
     <p class="book_id"> Id : ${book.id}</p>
     </div>
     
     <div class="book_mark">
           <i id="bookmark_${book.id}" class="fa-solid fa-bookmark bookmark" ></i>
     </div>
       <div class="book_description">
           <span class="description" >${description}</span>
       </div>
      
        <div class="book_cover">
            <img src="${bookCover}" alt="">
        </div>

  `);
  
  var parent = renderDiv|| document.getElementById('book_list'); //container si rien booklist sinon le @
    parent.insertAdjacentElement('beforeend', elementBook);
    return parent;
}
function renderBook(book, renderDiv) {
  createBook(book, renderDiv);
  document.getElementById(`bookmark_${book.id}`).addEventListener('click', ()=> addToPochlist(book));
}

function addToPochlist(book){
  let bookInStorage = JSON.parse(sessionStorage.getItem("pochlist"));

  if (bookInStorage) {
    const existingBooks = bookInStorage.find((currentBook)=>currentBook.id == book.id)
    if (!existingBooks){
      document.getElementById(`bookmark_${book.id}`).style.color = "red";
      bookInStorage.push(book);
    }else if(existingBooks){
      alert(" Vous ne pouvez ajouter deux fois le même livre");
     }
    else{
      document.getElementById(`bookmark_${book.id}`).style.color = "white";
      bookInStorage = bookInStorage.filter(currentBook => currentBook.id !== book.id);
    }
  }else{
    bookInStorage = [book];
  }
 
  renderPochList(bookInStorage);

  sessionStorage.setItem("pochlist", JSON.stringify(bookInStorage));        
}




function renderPochList(pochlist){
  const pochlistDiv = document.getElementById('pochlist');

  pochlistDiv.innerHTML = '';
  
  for(let book of pochlist){
    renderBook(book, pochlistDiv);
  }
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
        renderPochList(bookParse, true);
      }
    }
  }
}
  
function truncate(description, maxlength) {
  return (description.length > maxlength) ?
    description.slice(0, maxlength - 1) + '…' : description;
}
    
         
    
    
