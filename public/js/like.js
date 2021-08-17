import axios from 'axios';
import { showAlert } from './alert';

export const addLike = async () => {
  try {
    const tourId = window.location.pathname.split('/')[3];
    const res = await axios({
      method: 'POST',
      url: `/api/v1/likings/post-like/${tourId}`,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Thanks for your loving ❤️');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const removeLike = async () => {
  try {
    const tourId = window.location.pathname.split('/')[3];
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/likings/updateLiking/${tourId}`,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Hic 😒');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
