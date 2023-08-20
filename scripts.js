/* Global Variables */
const newMovieButton = document.querySelector('.new');
const addMovieButton = document.querySelector('.add');
const cancelButton = document.querySelector('.cancel');
const editButton = document.querySelector('.movie-edit-button');

const modalBackground = document.querySelector('.modalbackground');

const modalTitle = document.querySelector('#title');
const modalImageURL = document.querySelector('#image-url');
const modalRating = document.querySelector('#rating');

const movieList = document.querySelector('.list');
const demo = movieList.firstElementChild;

const movieNotes = document.querySelector('.movie-note-textarea');
const movieNoteTextArea = document.querySelector('.movie-note-class');
const movieNoteP = document.querySelector('.movie-note-p');

let movieArray = [];
let notesArray = [];

/* ~Model~ */
const saveLocal = () => {
  localStorage.setItem('movies', JSON.stringify(movieArray));
};
const retrieveLocal = JSON.parse(localStorage.getItem('movies'));
//---------Storage---------------------------

const pushMovie = () => {
  const movieTitle = modalTitle.value;
  const movieImage = modalImageURL.value;
  const movieRating = modalRating.value;
  const movieNote = 'Click edit button to enter your notes here!';

  movieArray.push({
    title: movieTitle,
    image: movieImage,
    rating: movieRating,
    note: movieNote
  });

  saveLocal();
};

const appendMovie = (array) => {
  movieList.innerHTML = '';

  for (let i = 0; i < array.length; i++) {
    const movieElement = document.createElement('li');
    movieElement.className = 'movie-element';
    movieElement.id = i;
    movieElement.innerHTML = `
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
              <div class='movie-note'>
                <div class="movie-note-textarea">
                    <textarea name="movie-note-area" class="movie-note-class" cols="77" rows="4" placeholder="Click the edit button when finished to save note."></textarea>
                </div>
                <p class="movie-note-p">${array[i].note}</p>
              </div>
    
              <div class='movie-edit-button'>
                <img src='images/edit.png' class='edit-button' />
              </div>                
            </div>
        </div>
    `;

    movieList.appendChild(movieElement);
  }
};

const clearModal = () => {
  modalTitle.value = '';
  modalImageURL.value = '';
  modalRating.value = '';
};

const editNote = () => {
  movieNotes.classList.toggle('visible');
};

const enterNote = () => {
  const note = movieNoteTextArea.value;

  if (note !== '') {
    movieNoteP.innerText = note;
  } else {
    movieNoteP.innerText = 'Click edit button to enter your notes here!';
  }

  movieNotes.classList.toggle('visible');
};

/* Visuals */
if (retrieveLocal) {
  movieArray = retrieveLocal;
  appendMovie(movieArray);
};

const toggleModal = () => {
  const modalContainer = document.querySelector('.modalcontainer');

  modalBackground.classList.toggle('visible');
  modalContainer.classList.toggle('visible');
};

const addMovieToList = () => {
  pushMovie();

  appendMovie(movieArray);

  clearModal();
  toggleModal();
};

const notes = () => {
  // console.log('hi');
  if (movieNotes.classList.contains('visible')) {
    enterNote();
  } else {
    editNote();
  }
};

/* Controllers */
newMovieButton.addEventListener('click', toggleModal);
addMovieButton.addEventListener('click', addMovieToList);

cancelButton.addEventListener('click', toggleModal);

editButton.addEventListener('click', notes);

// Rendering new elements is fucky and requires us to rescope global variables. Our global variables work on pre-rendered code, but once we render new elements via javascript, a new set of variables needs to be made for these post-rendered elements. Think of it kind of like the tentacles thing where our global variables grab the values that we have specified, but when we generate new elements we also have to generate new tentacles to go with them. The original tentacles do not simply replicate themselves.

movieList.addEventListener('click', (event) => {
  const demo = movieList.firstElementChild;
  if (demo.id !== 'demo-element') {
    const target = event.target;

    if (target.classList.contains('edit-button')) {
      const movieElement = target.closest('.movie-element'); // Get the closest parent li element
      const id = movieElement.id;
      const movieNote = movieElement.querySelector('.movie-note-textarea'); // Find the textarea-container within the li
      const movieNoteP = movieElement.querySelector('.movie-note-p'); // Find the <p> of the li
      const saveLocal = () => {
        localStorage.setItem('movies', JSON.stringify(movieArray));
      };
      movieArray = JSON.parse(localStorage.getItem('movies'));

      const editNote = () => {
        movieNote.classList.toggle('visible');
      };

      const enterNote = () => {
        const movieNoteTextArea = movieElement.querySelector('.movie-note-class'); // textarea element
        const note = movieNoteTextArea.value; // textarea value

        if (note !== '') {
          movieArray[id].note = note;
          movieNoteP.innerText = `${movieArray[id].note}`;
          saveLocal();
        };

        movieNote.classList.toggle('visible');
      };

      const notes = () => {
        if (movieNote.classList.contains('visible')) {
          enterNote();
        } else {
          editNote();
        }
      };
      notes();
    }
  }
});
