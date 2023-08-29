/* Global Variables */
const demoElement = document.querySelector('#demo-element');

const searchbar = document.querySelector('.searchbar');
const clearSearch = document.querySelector('.search-clear-icon');
const searchButton = document.querySelector('.search-icon');
const filterMenu = document.querySelector('.menu-container');
const filterSelect = document.querySelector('.arrow-icon');
const filterChoice = document.querySelector('.filter-menu');
const filterDisplay = document.querySelector('.filter-display');
const filterAlpha = document.querySelector('.filter-alpha');
const filterRating = document.querySelector('.filter-rating');
const filterReset = document.querySelector('.filter-reset');

const newMovieButton = document.querySelector('.new');
const addMovieButton = document.querySelector('.add');
const cancelButton = document.querySelector('.cancel');

const modalBackground = document.querySelector('.modalbackground');
const modalImageURL = document.querySelector('#image-url');
const modalTitle = document.querySelector('#title');
const modalRating = document.querySelector('#rating');

const movieList = document.querySelector('.list');
const demo = movieList.firstElementChild;

const movieNoteTextArea = document.querySelector('.input-movie-note');
const movieNoteP = document.querySelector('.displayed-movie-note');

const retrieveLocal = JSON.parse(localStorage.getItem('movies'));

let movieArray = [];

/* ~Model~ */
const searchFunction = (searchValue) => {
  const userInput = searchValue.toLowerCase();

  const searchResult = movieArray.filter((movie) => {
    const title = movie.title.toLowerCase().includes(userInput);
    const note = movie.note.toLowerCase().includes(userInput);
    console.log(title, note);

    return title || note;
  });

  if (filterMenu.classList.contains('visible')) {
    filterMenu.classList.toggle('visible');
    filterDisplay.innerText = 'Filter Options';
  }

  appendMovie(searchResult);
};
const clearSearchValue = () => {
  searchbar.value = '';
  appendMovie(movieArray);
};

const filterArrow = () => {
  if (filterMenu.classList.contains('visible')) {
    filterChoice.classList.toggle('visible');
  } else {
    filterMenu.classList.toggle('visible');
    filterChoice.classList.toggle('visible');
  }
};
const filterOptionAlphabetical = () => {
  filterDisplay.innerText = 'Alphabetical';

  const alphabeticalMovies = movieArray.sort((a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();

    if (titleA < titleB) {
      return 1;
    }
    if (titleA > titleB) {
      return -1;
    }
    return 0;
  });

  searchbar.value = '';
  appendMovie(alphabeticalMovies);
  filterChoice.classList.toggle('visible');
};
const filterOptionRating = () => {
  filterDisplay.innerText = 'Rating';

  const numericalMovies = movieArray.sort((a, b) => a.rating - b.rating);

  searchbar.value = '';
  appendMovie(numericalMovies, false);
  filterChoice.classList.toggle('visible');
};
const filterOptionReset = () => {
  filterDisplay.innerText = 'Reset List';

  location.reload();
};

const demoShow = () => {
  demoElement.classList.remove('hidden');
  demoElement.classList.add('visible');
  setTimeout(() => {
    demoElement.style.opacity = 1;
  }, 1 * 1000);
};
const demoHide = () => {
  demoElement.classList.remove('visible');
  demoElement.classList.add('hidden');
};

const pushMovie = () => {
  const movieId = Math.floor(Math.random() * 10000);
  const movieTitle = modalTitle.value;
  const movieImage = modalImageURL.value;
  const movieRating = modalRating.value;
  const movieNote = 'Click edit-button to enter notes here!';

  movieArray.push({
    id: movieId,
    title: movieTitle,
    image: movieImage,
    rating: movieRating,
    note: movieNote,
  });
};
const appendMovie = (array, applyFading = true) => {
  if (array[0]) {
    demoHide();
  } else if (array === []) {
    demoShow();
  }

  movieList.innerHTML = '';

  for (let i = array.length - 1; i >= 0; i--) {
    const movieElement = document.createElement('div');
    movieElement.className = 'movie-element';
    movieElement.id = array[i].id;
    movieElement.innerHTML = `
        <div class='delete-button-container'>
            <img src='images/delete.png' class='delete-button' />
            <h6 class="delete-cursor-note">Delete</h6>
        </div>

        <div class='movie-image-container'>
            <img src='${array[i].image}' alt='movie-pic' class='movie-pic' />
        </div>

      <div class='movie-info-container'>
          <div class='movie-title'>
            <h2>${array[i].title}</h2>
          </div>
        

          <div class='movie-rating-container'>
            <p>${array[i].rating}/10</p>
          </div>

          <div class='movie-note-container'>
            <div class='movie-notes'>
              <textarea name="movie-note-area" class="input-movie-note" cols="77" rows="4" placeholder="Click the edit button when finished to save note."></textarea>
              <p class="displayed-movie-note">${array[i].note}</p>
            </div>
  
            <div class='movie-edit-button'>
              <img src='images/edit.png' class='edit-button' />
              <h6 class="edit-cursor-note">Edit</h6>
            </div>                
          </div>
      </div>
    `;

    const deleteButtonEl = movieElement.querySelector(
      '.delete-button-container'
    );
    const deleteButton = movieElement.querySelector('.delete-button');
    const editButton = movieElement.querySelector('.edit-button');
    const movieNoteTextArea = movieElement.querySelector('.input-movie-note');
    const movieNoteP = movieElement.querySelector('.displayed-movie-note');

    const editNote = () => {
      movieNoteTextArea.classList.toggle('visible');
      movieNoteP.classList.toggle('visible');
      deleteButtonEl.classList.toggle('visible');
    };
    const enterNote = (id) => {
      const note = movieNoteTextArea.value;
      movieArray.find((movie) => {
        if (movie.id === id) {
          movie.note = note;
        }
      });

      saveLocal();
      appendMovie(movieArray, false);

      movieNoteTextArea.classList.toggle('visible');
      movieNoteP.classList.toggle('visible');
      deleteButtonEl.classList.toggle('visible');
    };
    const notes = (id) => {
      if (movieNoteTextArea.classList.contains('visible')) {
        enterNote(id);
      } else {
        editNote();
        if (movieNoteP.innerText !== 'Click edit-button to enter notes here!') {
          movieNoteTextArea.value = movieNoteP.innerText;
        }
      }
    };

    const deleteMovieFromArray = (array, id) => {
      let newArray = array.filter((movie) => movie.id !== id);
      if (newArray[0]) {
        return newArray;
      } else {
        newArray = [];
        return newArray;
      }
    };
    const deleteMovieFromInterface = (array, id) => {
      const deletedArray = deleteMovieFromArray(array, id);
      if (deletedArray[0]) {
        movieArray = deletedArray;
        saveLocal();
        appendMovie(movieArray);
      } else {
        resetLocal();
        movieList.innerHTML = '';
        demoShow();
      }
    };

    deleteButton.addEventListener('click', (event) => {
      const movieId = parseInt(event.target.closest('.movie-element').id);
      deleteMovieFromInterface(movieArray, movieId);
    });
    editButton.addEventListener('click', (event) => {
      const id = parseInt(event.target.closest('.movie-element').id);
      notes(id);
    });

    movieList.appendChild(movieElement);

    if (applyFading) {
      setTimeout(() => {
        movieElement.style.opacity = 1;
      }, (array.length - 1 - i) * 250);
    } else {
      movieElement.style.opacity = 1;
    }
  }
};

const clearModal = () => {
  modalTitle.value = '';
  modalImageURL.value = '';
  modalRating.value = 5;
};
const toggleModal = () => {
  const modalContainer = document.querySelector('.modalcontainer');

  modalBackground.classList.toggle('visible');
  modalContainer.classList.toggle('visible');

  if (modalContainer.classList.contains('visible')) {
    modalImageURL.focus();
  }
};
const resetModal = () => {
  clearModal();
  toggleModal();
};

const saveLocal = () => {
  localStorage.setItem('movies', JSON.stringify(movieArray));
};
const resetLocal = () => {
  movieArray = [];
  saveLocal();
};

const finishMovieAdd = () => {
  if (modalImageURL.value && modalTitle.value && modalRating.value) {
    pushMovie();
    appendMovie(movieArray);
    resetModal();
    saveLocal();
  } else {
    return;
  }
};

/* Visuals */
if (Array.isArray(retrieveLocal)) {
  movieArray = retrieveLocal;
  appendMovie(movieArray);
} else {
  movieArray = [];
}

/* Controllers */
clearSearch.addEventListener('click', clearSearchValue);
searchbar.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchFunction(searchbar.value);
  }
});
searchButton.addEventListener('click', () => {
  searchFunction(searchbar.value);
});
filterSelect.addEventListener('click', filterArrow);
filterAlpha.addEventListener('click', filterOptionAlphabetical);
filterRating.addEventListener('click', filterOptionRating);
filterReset.addEventListener('click', filterOptionReset);

newMovieButton.addEventListener('click', toggleModal);

addMovieButton.addEventListener('click', finishMovieAdd);
cancelButton.addEventListener('click', toggleModal);
