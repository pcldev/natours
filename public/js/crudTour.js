import axios from 'axios';
import { showAlert } from './alert';

export const updateTour = async (tourId, data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/tours/${tourId}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `Updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteTour = async (tourId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/tours/${tourId}`,
    });
    if (res.status !== 'success') {
      showAlert('success', 'Deleted successfully');
      window.setTimeout(() => {
        location.assign('/manage-tours');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const createTour = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'api/v1/tours',
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `Created successfully!`);
      window.setTimeout(() => {
        location.assign('/manage-tours');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
