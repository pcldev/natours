import '@babel/polyfill';
import { login, logout } from './login';
import { signup } from './signup';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

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
