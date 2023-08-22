/* Global Variables */
const demoElement = document.querySelector('#demo-element');

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
const appendMovie = (array) => {
  if (array[0]) {
    movieList.innerHTML = '';
  } else {
    return;
  }

  for (let i = 0; i < array.length; i++) {
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
      movieArray.find(movie => {
        if (movie.id === id) {
          movie.note = note;
        }
      });

      saveLocal();
      appendMovie(movieArray);

      movieNoteTextArea.classList.toggle('visible');
      movieNoteP.classList.toggle('visible');
      deleteButtonEl.classList.toggle('visible');
    };
    const notes = (id) => {
      if (movieNoteTextArea.classList.contains('visible')) {
        enterNote(id);
      } else {
        editNote();
        movieNoteTextArea.value = movieNoteP.innerText;
      }
    };

    const deleteMovieFromArray = (array, id) => {
      const newArray = array.filter((movie) => movie.id !== id); 
      return newArray;
    };
    const deleteMovieFromInterface = (array, id) => {
      movieArray = deleteMovieFromArray(array, id);
      saveLocal();
      appendMovie(movieArray);
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
}

/* Controllers */
newMovieButton.addEventListener('click', toggleModal);

addMovieButton.addEventListener('click', finishMovieAdd);
cancelButton.addEventListener('click', toggleModal);

// Rendering new elements is fucky and requires us to rescope global variables. Our global variables work on pre-rendered code, but once we render new elements via javascript, a new set of variables needs to be made for these post-rendered elements. Think of it kind of like the tentacles thing where our global variables grab the values that we have specified, but when we generate new elements we also have to generate new tentacles to go with them. The original tentacles do not simply replicate themselves.
