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


    // création du bouton de recherche
    
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


async function searchBook(){
  book.title = inputTitle.value;
  book.author = inputAuthor.value;

  const url="https://www.googleapis.com/books/v1/volumes?AIzaSyBPzxg5cRwtZ9C-dyJqIAegQIHhngSHPdQ&q="+ book.title+ "" + book.author;
  const bookList = await fetch(url).then((response) => response.json());
  
  console.log(bookList);

  const outputList = document.querySelector("#content");
  const container =
    `<div>
    <h2>Résultat de recherche</h2>
    
    <div id="searchResults" >
    <ul class="book_list cards container" id="book_list">
      
      </ul>
      </div>
    `;

    outputList.insertAdjacentHTML('afterbegin',container);

  for(const book of bookList.items){
    renderBook(book)
  }

}


function renderBook(book) {
const elementBook = document.createElement('li');
elementBook.classList.add('card');
var placeHldr = document.createElement('img');

//je crée la variable qui va contenir l'image par defaut ici
placeHldr.setAttribute("src", "/assets/img/cover.png");
console.log("ici mon placeholer  :" + placeHldr.src)
var bookCover = book.volumeInfo?.imageLinks?.thumbnail ? book.volumeInfo.imageLinks.thumbnail : placeHldr.src;
console.log("Mon book Cover ici : "+ bookCover);

elementBook.insertAdjacentHTML('beforeend', `
<h3 class="book_title">${book.volumeInfo.title}</h3>
<p class="book_author">${book.volumeInfo.authors}</p>
<p class="book_id">${book.id}</p>
<img src="${bookCover}" alt="book cover">
<span class="book_description">${book.volumeInfo.description}</span>
`);
  var parent = document.getElementById('book_list');
  parent.insertAdjacentElement('beforeend', elementBook);
  

}

//function LimitDesc(){
  //desc = ${book.volumeInfo.description};
  //if( desc === undefined){
   // description ="information manquante";
  //}else{
   // (book.volumeInfo.description).substring(0, 100);
  //}
 
//}
//LimitDesc();

searchBookBtn.addEventListener('submit', searchBook);



function getFieldValue(elementId) {
  var element = document.getElementById(elementId);
  return element.value || "";
}

function clearElement(parentId) {
  var element = document.getElementById(parentId);
  if (element) {
    element.innerHTML = "";
  }
}
function addElement(parent, tag, attributes) {
  var element = document.createElement(tag);

  // Affecter les attributs au nouvel élément à créer
  for (key of Object.keys(attributes)) {
    element[key] = attributes[key];
  }

  var parentDOM = document.getElementById(parent) || parent;
  parentDOM.appendChild(element);
  return element;
}
function showSearchBookForm() {
  // Effacer contenu de la recherche
  clearElement("searchForm");

  const formDiv = addElement("searchForm", "form", {
    id: "newForm",
    action: "",
    onsubmit: function () {
      searchBookOnGoogle({
        title: getFieldValue("title"),
        author: getFieldValue("author"),
      });
      return false;
    },
  });

  // Creer champs du formulaire
  addElement(formDiv, "input", {
    type: "text",
    name: "title",
    placeholder: "Titre du livre",
    id: "title",
    required: true,
  });

  addElement(formDiv, "input", {
    type: "text",
    name: "author",
    placeholder: "Auteur du livre",
    id: "author",
    required: true,
  });

  // Ajouter bouton de rechérche
  var searchBookButton = document.createElement("button");
  searchBookButton.innerHTML = "Rechercher";
  searchBookButton.type = "submit";
  searchBookButton.style.backgroundColor = "#009966";
  searchBookButton.style.margin = "8%";
  searchBookButton.style.width = "35%";
  // Ajouter le bouton de rechercher sur la page
  formDiv.appendChild(searchBookButton);

  // Ajouter bouton annuler
  var deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Annuler";
  deleteButton.type = "reset";
  deleteButton.style.backgroundColor = "#FF0000";
  deleteButton.style.margin = "8%";
  deleteButton.style.width = "35%";
  deleteButton.onclick = function () {
    // Effacer contenu de la recherche
    clearElement("searchResults");
    return true;
  };
  //Ajouter le bouton delete sur ma page
  formDiv.appendChild(deleteButton);

  var addBookButton = document.createElement("button");
  addBookButton.innerHTML = "Ajouter ce livre";
  addBookButton.onclick = function () {
    //fonction d'ajout du livre
    addBookButton.innerHTML = document.getElementById("bookAddAction");
    addBookInList({
      title: titleBookInput.value,
      author: authorBookInput.value,
    });
    return false;
  };
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function searchBookOnGoogle(book) {
  // 1. Formatter l'URL de recherche Google avec les paramètres de l'objet book
  let googleBookAPIURL =
    "https://www.googleapis.com/books/v1/volumes?q=" +
    "+intitle:" +
    book.title +
    "" +
    "+inauthor:" +
    book.author;

  // console.log(googleBookAPIURL);

  // 2. Lancer la requête
  $.ajax({
    url: googleBookAPIURL.toString(),
    dataType: "jsonp",
    crossDomain: true,
    success: function (data) {
      // 3. Récupérer les résultats
      updateSearchResults(data);
    },
  });
}
  
function getTBooksFromLS() {
  let books;

  if (localStorage.getItem("books") === null) {
    books = [];
  } else {
    todos = JSON.parse(localStorage.getItem("books"));
  }

  books.forEach(book => {
    // create book elements
    const li = document.createElement("li");
    const todoTitle = document.createElement("span");
    const editableInput = document.createElement("input");
    const editButton = document.createElement("button");
    const saveButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    li.classList.add("todo-collection__item");

    todoTitle.classList.add("todo-collection__item__title");
    todoTitle.innerText = todoInput.value;

    editableInput.classList.add("input");
    editableInput.classList.add("input--todo");
    editableInput.classList.add("hidden");
    editableInput.type = "text";
    editableInput.value = todoInput.value;

    editButton.classList.add("button");
    editButton.classList.add("button--todo");
    editButton.classList.add("button--edit");
    editButton.innerText = "Edit";

    saveButton.classList.add("button");
    saveButton.classList.add("button--todo");
    saveButton.classList.add("button--save");
    saveButton.classList.add("hidden");
    saveButton.innerText = "Save";

    deleteButton.classList.add("button");
    deleteButton.classList.add("button--todo");
    deleteButton.classList.add("button--delete");
    deleteButton.innerText = "Delete";

    // add elements to todo list
    li.appendChild(todoTitle);
    li.appendChild(editableInput);
    li.appendChild(editButton);
    li.appendChild(saveButton);
    li.appendChild(deleteButton);
    todoCollection.appendChild(li);

    function toggleTodoEditForm() {
      todoTitle.classList.toggle("hidden");
      editableInput.classList.toggle("hidden");
      editButton.classList.toggle("hidden");
      saveButton.classList.toggle("hidden");
    }

    // button event listeners
    editButton.addEventListener("click", () => {
      toggleTodoEditForm();
      editableInput.focus();
    });

    saveButton.addEventListener("click", () => {
      todoTitle.innerText = editableInput.value;
      toggleTodoEditForm();
    });

    deleteButton.addEventListener("click", () => {
      setTimeout(() => {
        todoCollection.removeChild(li);
      }, 100);
    });
  });
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    createBookElements(book)
    console.log("search " + book);
  }

}


function addElement() {
var element = document.createElement('li');
element.classList.add("book_item");
var parent = document.getElementById('book_list');
parent.insertAdjacentHTML('afterbegin', element);
}

function createBookElements(){
  // create book elements
  const bookItem = document.createElement("li");
  const imgCover = document.createElement("img");
  const bookTitle = document.createElement("h3");
  const bookAuthors = document.createElement("h4");
  const bookDesc = document.createElement("span");
  const bookId = document.createElement("p");
  const deleteButton = document.createElement("button");
  const bookmark = document.createElement("i");
  const placeHldr = document.createElement("img");
  const deleteFromPochlistBtn = document.createElement("btn");
  
  //Set variables in html elements
  //je crée la variable qui va contenir l'image par defaut ici
  placeHldr.setAttribute("src", "/assets/img/unavailable.png");
  console.log("ici mon placeholer  :" + placeHldr.src)
  var bookCover = book.volumeInfo?.imageLinks?.thumbnail ? book.volumeInfo.imageLinks.thumbnail : placeHldr.src;
  imgCover.innerHTML = "<img width='100' height='100' src='" +
    bookCover +
    "' />";
  //const authors = book.volumeInfo?.authors? book.volumeInfo.authors : "auteur non renseigné";
  //var description =  book.volumeInfo?.description? book.volumeInfo.description :"Information manquante";
  bookTitle.innerHTML = '<h3 class="book_title">${book.volumeInfo.title}</h3>';
  bookAuthors.innerHTML = '<p class="book_id">${book.volumeInfo?.authors? book.volumeInfo.authors : "auteur non renseigné"}</h4>';
  bookId.innerHTML = '<p class="book_author"> Id : ${book.id}</p>';
  bookDesc.innerHTML = '<span class="book_description">${book.volumeInfo?.description? book.volumeInfo.description :"Information manquante"}</span>';
  bookmark.innerHTML = '<i class="fa-solid fa-bookmark"></i>';
  deleteBtn.innerHTML = '<button class="btn delete" data-delete-tasks-btn>Supprimer</button>';
  
  //Set Css class on elements
  bookItem.classList.add('card');
  // add elements to book list
  bookItem.appendChild(imgCover);
  bookItem.appendChild(bookTitle);
  bookItem.appendChild(bookAuthors);
  bookItem.appendChild(bookId);
  bookItem.appendChild(bookDesc);
  bookItem.appendChild(bookmark);
  bookItem.appendChild(deleteFromPochlistBtn);

  console.log("CREATE " + bookItem);
  }


function renderBook(book) {
  for (const book of Object.keys(bookList)) {
    console.log(book);
    createBookElements(book);
    var parent = document.getElementById('book_list');
    parent.insertAdjacentHTML('beforeend', book);
  }

  }

  

    
  // container = document.getElementById('serach_container');
  //  container.insertAdjacentElement('beforeend',parent);
    

  
searchBookBtn.addEventListener('submit', searchBook);