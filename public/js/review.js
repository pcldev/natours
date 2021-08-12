import axios from 'axios';
import { showAlert } from './alert';
export const postReview = async (review, rating) => {
  try {
    const tourId = window.location.pathname.split('/')[3];
    const res = await axios({
      method: 'POST',
      url: `/api/v1/tours/${tourId}/reviews`,
      data: {
        review,
        rating,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Thanks for your review!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
