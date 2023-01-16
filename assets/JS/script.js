const btnAdd = `
<button id="addBook" class="myBtn" type="submit">Ajouter un livre </button>
`
const form =`
<div class="modal">
<h2>Rechercher un livre</h2>
<form class="search_form"> 
<label for="book_title">Titre du Livre :</label>
<input name="book_title" type="text" class="search" placeholder="Titre du Livre" required>
<label for="author">Auteur :</label>
<input name="author"type="text"  class="submit" placeholder="Auteur" required>
</form>
<button id="lookUp" class="myBtn" type="submit">Rechercher</button>
<button id="cancel" class="myBtn" type="submit">Annuler</button>
</div>
`

document.querySelector('#myBooks').insertAdjacentHTML ('beforeend', btnAdd);

var addBook = document.querySelector("#addBook");
addBook.addEventListener('click', showForm);
function showForm(){
    addBook.insertAdjacentHTML ('beforebegin', form);
    addBook.classList.add('hidden');
};

