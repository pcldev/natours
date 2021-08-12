import '@babel/polyfill';
import { login, logout } from './login';
import { signup } from './signup';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { postReview } from './review';

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
const cmtBtn = document.querySelector('.postReview');

const logOutBtn = document.querySelector('.nav__el--logout');

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
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

if (cmtBtn) {
  const stars = document.querySelectorAll('.star');
  let starRating = 1;
  for (let i = 0; i < stars.length; i++) {
    stars[i].starValue = i + 1;
    ['mouseover', 'mouseout', 'click'].forEach(function (e) {
      stars[i].addEventListener(e, starRate);
    });
  }

  function starRate(e) {
    let type = e.type;
    let starValue = this.starValue;
    if (type === 'click') {
      if (starValue > 1) {
        // console.log(starValue);
        starRating = starValue;
      }
    }
    stars.forEach(function (ele, ind) {
      if (type === 'click') {
        if (ind < starValue) {
          ele.classList.add('fix');
        } else {
          ele.classList.remove('fix');
        }
      }
      if (type === 'mouseover') {
        if (ind < starValue) {
          ele.classList.add('over');
        } else {
          ele.classList.remove('over');
        }
      }
      if (type === 'mouseout') {
        ele.classList.remove('over');
      }
    });
  }
  cmtBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const cmtBox = document.getElementById('commentBox').value;
    postReview(cmtBox, starRating);
  });
}
