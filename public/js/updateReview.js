import axios from 'axios';
import { showAlert } from './alert';

export const updateReview = async (id, rating, review) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `api/v1/reviews/${id}`,
      data: {
        rating,
        review,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', `Updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
