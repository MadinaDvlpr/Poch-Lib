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
  
  function removeBookFromPochList(book) {
    const bookIDToRemove = book.id;
    // Retirer du DOM
    const divBook = document.getElementById("myBooks-" + bookIDToRemove);
    divBook.remove();
    // Retirer du session storage
    const booksInSession = sessionStorage.getItem("books");
    if (booksInSession) {
      const booksInSessionArray = booksInSession.split("|");
      const booksInSessionWithoutRemovedItem = booksInSessionArray.filter(
        (currentBookJsonEncoded) =>
          //Utiliser la librairie JSON pour récup l'Id du livre
          (JSON.parse(currentBookJsonEncoded) || {}).id !== book.id
      );
      sessionStorage.setItem("books", booksInSessionWithoutRemovedItem.join("|"));
    }
  }
  
  function addBookToPochList(book, checkIfExisting) {
    let bookListInSessionStorage = sessionStorage.getItem("books");
    let bookExists = false;
  
    if (checkIfExisting) {
      if (bookListInSessionStorage) {
        const booksInSession = bookListInSessionStorage.split("|");
        const existingBooksInSession = booksInSession.filter(
          (currentBookJsonEncoded) =>
            (JSON.parse(currentBookJsonEncoded) || {}).id === book.id
        );
        if (existingBooksInSession.length) {
          // Vérifier que le book n'est pas déjà dans la session
          // Si pas déjà présent ==> l'ajouter au session storage
          bookExists = true;
        }
      }
    }
  
    if (!bookExists) {
      // Ajouter au session storage
      const bookData = JSON.stringify(book);
      if (bookListInSessionStorage) {
        bookListInSessionStorage = bookListInSessionStorage + "|" + bookData;
      } else {
        bookListInSessionStorage = bookData;
      }
  
      sessionStorage.setItem("books", bookListInSessionStorage);
    }
  
    // Add book in poch list (myBooks) ; with no bookmarks
    addBookItemInDOM("myBooks", book, false);
  }
  function viderPochList() {
    clearElement("myBooks");
  }
  
  function addBookItemInDOM(target, book, hasBookmark) {
    // Créer div pour le book
    const bookID = target + "-" + book.id;
    addElement(target, "div", {
      className: "book-item",
      id: bookID,
    });
  
    if (hasBookmark) {
      // Créer icone bookmark pour le book (dans le conteneur du book)
      addElement(bookID, "div", {
        className: "book-bookmark",
        innerHTML: "<img width='24' height='24' src='bookmark.png' />",
        onclick: function () {
          const checkBookInDOM = document.getElementById("myBooks-" + book.id);
          if (!checkBookInDOM) {
            addBookToPochList(book, true);
          } else {
            alert("“Vous ne pouvez pas ajouter deux fois le même livre");
          }
        },
      });
    } else {
      // Créer icone suppression pour le book (dans le conteneur du book)
      addElement(bookID, "div", {
        className: "book-delete",
        innerHTML:
          "<image width ='24' height='24' src='Places-trash-empty-icon.png' />",
        onclick: function () {
          removeBookFromPochList(book);
        },
      });
    }
  
    // Insérer le titre (dans le conteneur du book)
    addElement(bookID, "div", {
      className: "book-title",
      innerHTML: "Titre: " + book.volumeInfo.title,
    });
  
    // Insérer l'ID (dans le conteneur du book)
    addElement(bookID, "div", {
      className: "book-id",
      innerHTML: "ID: " + book.id,
    });
  
    // Insérer l'auteur (dans le conteneur du book)
    addElement(bookID, "div", {
      className: "book-author",
      innerHTML: "Auteurs: " + (book.volumeInfo.authors || []).join(", "),
    });
  
    // Insérer la description (dans le conteneur du book)
    addElement(bookID, "div", {
      className: "book-description",
      innerHTML: book.volumeInfo.description
        ? `Description:${book.volumeInfo.description}`
        : "Informations manquantes",
    });
  
    // Insérer l'imagine (dans le conteneur du book)
    addElement(bookID, "div", {
      className: "book-image",
      innerHTML: book.volumeInfo.imageLinks
        ? "<img width='100' height='100' src='" +
          book.volumeInfo.imageLinks.thumbnail +
          "' />"
        : "<img width='100' height='100' src='unavailable.png' />",
    });
  }
  
  function updateSearchResults(data, limit) {
    clearElement("searchResults");
  
    if (!limit) {
      limit = 4;
    }
  
    const items =
      data.totalItems > 0 &&
      data.items.filter(function (item, index) {
        return index < limit;
      });
    if (data.totalItems > 0) {
      // Si y'a plusieurs livres > 0, alors les afficher
      for (const book of items) {
        // Add book in search results ; with bookmarks
        addBookItemInDOM("searchResults", book, true);
      }
    } else {
      addElement("searchResults", "div", {
        className: "no-search-result",
        innerHTML: "Aucun livre n'a été trouvé",
      });
    }
  }
  
  function loadBooksFromStorage() {
    const books = sessionStorage.getItem("books");
    if (books) {
      // Si des livres sont présents dans la session storage
      // Format "bookID1, bookID2"
      const listeBooks = books.split("|");
  
      // Charger la poch list
      for (const bookJSON of listeBooks) {
        if (bookJSON) {
          const bookParse = JSON.parse(bookJSON);
          addBookToPochList(bookParse, true);
        }
      }
    }
  }