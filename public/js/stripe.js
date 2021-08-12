import axios from 'axios';
const stripe = Stripe(
  'pk_test_51JMUVrBaOSK7KIeB6O7XGJf5iIIF9noWdJFPsXyUH7FUApw8Ks7vnbZL0DrWowRN8N7hQU9O6kT9gjIQlO5tjebo00lqw6Vw2V'
);
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // 2) Create checkout form + change credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
