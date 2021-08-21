import '@babel/polyfill';
import { login, logout } from './login';
import { signup } from './signup';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { postReview } from './review';
import { addLike, removeLike } from './like';
import { updateReview } from './updateReview';
import { updateTour, deleteTour, createTour } from './crudTour';

const queryForm = function (thisQuery, func) {
  const forms = thisQuery.querySelectorAll('input');
  const values = Array.from(forms).map((val) => val.value);
  func(...values);
};

//DOM ELEMENTS
const mapbox = document.getElementById('map');

const loginForm = document.querySelector('.form__login');
const signupForm = document.querySelector('.form__signup');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const postBtn = document.querySelector('.postBtn');
const likeBtn = document.querySelector('.likeBtn');
const updateReviewBtns = document.querySelectorAll('#update__review');
const updateTourBtn = document.getElementById('save-update-tour-btn');
const deleteTourBtn = document.getElementById('btn--delete-tour');
const createTourBtn = document.getElementById('btn--create-tour');

const logOutBtn = document.querySelector('.nav__el--logout');

if (postBtn) {
  // const post = document.querySelector('.post');
  const stars = document.querySelectorAll('.fas.fa-star');
  const textarea = document.querySelector(
    'body > section.section-reviews > div.review__block > div > div.star-widget > form > div.textarea > textarea'
  );
  let starRating = 1;
  stars.forEach((star) => {
    star.addEventListener('click', (e) => {
      starRating = parseInt(e.target.dataset.star);
    });
  });
  postBtn.onclick = (e) => {
    e.preventDefault();
    postReview(textarea.value, starRating);
    // widget.style.display = 'none';
    // post.style.display = 'block';
    // return false;
  };
}

if (likeBtn) {
  likeBtn.addEventListener('click', async () => {
    const heartIcon = document.querySelector('.heart__icon');
    if (document.querySelector('.heart__icon.active')) {
      heartIcon.classList.remove('active');
      await removeLike();
    } else {
      heartIcon.classList.add('active');
      await addLike();
    }
  });
}

if (updateReviewBtns) {
  updateReviewBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = e.target.closest('#update__review').dataset.reviewid;
      const rating = e.target
        .closest('.card__footer')
        .parentElement.querySelector('select').value;
      const reviewing = e.target
        .closest('.card__footer')
        .parentElement.querySelector('textarea').value;
      updateReview(id, rating, reviewing);
    });
  });
}

if (updateTourBtn) {
  updateTourBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const tourId = e.target.dataset.tourid;
    const inputText = document.querySelectorAll('input[type=text]');
    const inputNum = document.querySelectorAll('input[type=number]');
    const difficulty = document.querySelector('select').value;
    const dates = document.querySelectorAll('#date');
    const titleNum = ['duration', 'price'];
    const titleText = ['name', 'summary', 'description'];
    const startDates = [];
    const data = {};
    dates.forEach((date) =>
      startDates.push(
        // new Date(`${date.value}T09:00:00.000+00:00`).toJSON().valueOf()
        new Date(date.value)
      )
    );
    data['startDates'] = startDates;
    data['difficulty'] = difficulty;
    //obj["key3"] = "value3"; *
    inputNum.forEach((num, idx) => {
      data[titleNum[idx]] = num.value;
    });
    inputText.forEach((text, idx) => {
      data[titleText[idx]] = text.value;
    });
    updateTour(tourId, data);
  });
}

if (deleteTourBtn) {
  deleteTourBtn.addEventListener('click', (e) => {
    const tourId = e.target.dataset.tourid;
    deleteTour(tourId);
  });
}

if (createTourBtn) {
  const modal = document.querySelector('.modal');
  createTourBtn.addEventListener('click', (e) => {
    modal.classList.add('active');
    const submitBtn = document.getElementById('btn--submit-tour');
    const data = {};
    const formStartLocation = document.querySelectorAll(
      '#startLocation > input'
    );
    const formimages = document.querySelectorAll('#images > input');
    const formStartDates = document.querySelectorAll('#startDates > input ');
    const formLocations = document.querySelectorAll('#locations > input');
    const anotherForm = document.querySelectorAll('#another > input');
    const anotherTextArea = document.querySelectorAll('#another > textarea');
    const coordinates_startLocation = document.querySelectorAll(
      '#coordinates--startLocation > input'
    );
    const coordinates_locations = document.querySelectorAll(
      '#coordinates--locations > input'
    );
    const coordinatesStartlocation = [];
    const coordinatesLocations = [];
    const startLocationArr = ['description', 'type', 'address'];
    const startLocation = {};
    const images = [];
    const startDates = [];
    const locations = [];
    const location = {};
    const locationtitleArr = ['description', 'type', 'day'];
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      formStartLocation.forEach((val, index) => {
        // if(startLocationArr[index]==='coordinates') startLocation[`${startLocationArr[index]}`]=
        startLocation[`${startLocationArr[index]}`] = val.value;
      });
      data['startLocation'] = startLocation;
      coordinates_startLocation.forEach((val) => {
        coordinatesStartlocation.push(parseInt(val.value));
      });
      data.startLocation.coordinates = coordinatesStartlocation;
      formimages.forEach((val, index) => {
        images.push(val.value);
      });
      data['images'] = images;
      formStartDates.forEach((val, index) => {
        startDates.push(val.value);
      });
      data['startDates'] = startDates;
      formLocations.forEach((val, index) => {
        location[`${locationtitleArr[index]}`] = val.value;
      });
      locations.push(location);
      data['locations'] = locations;

      anotherForm.forEach((val, index) => {
        data[`${val.attributes['name'].value}`] = val.value;
      });

      anotherTextArea.forEach((val, index) => {
        data[`${val.attributes['name'].value}`] = val.value;
      });
      coordinates_locations.forEach((val) => {
        coordinatesLocations.push(parseInt(val.value));
      });
      data.locations[0].coordinates = coordinatesLocations;
      console.log(data);
      // createTour(data);
    });
  });
  const closeModalBtn = document.querySelector('.btn--close-modal');
  closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });
}

if (mapbox) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );

  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    queryForm(this, login);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    queryForm(this, signup);
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    await updateSettings(form, 'data');

    // setTimeout(() => {
    //   window.location.reload();
    // }, 1500);
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--password').textContent = 'Updating ...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const check = await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn--password').textContent = check
      ? 'Update successfully!'
      : 'Update failed';

    document.getElementById('password-current').value = undefined;
    document.getElementById('password').value = undefined;
    document.getElementById('password-confirm').value = undefined;

    if (check)
      setTimeout(() => {
        location.reload();
      }, 1500);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (bookBtn) {
  const quantity = document.getElementById('quantity');
  const priceLive = document.getElementById('price');
  if (!priceLive) return;
  const priceDefault = parseInt(priceLive.innerHTML);
  quantity.addEventListener('change', () => {
    priceLive.innerHTML = `${priceDefault * quantity.value} $`;
  });
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId, quantity.value);
  });
}
