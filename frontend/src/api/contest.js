import axios from "axios";
import config from "./config";
import { ToastContainer, toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';

const token = localStorage.getItem('@twinphy-token');
const userId = localStorage.getItem('@twinphy-user')?.replace(/"/g, '');
const url = config.BASE_URL + "/contest/";
const apiConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const getContest = () => {
    return config.makeRequest(() => {
        return axios
            .get(`${url}/getcontestlist`, apiConfig)
            .then((res) => { return res?.data?.data })
            .catch((err) => console.log(err));
    });
};


export const makePayment = async () => {
  try {
    const stripe = await loadStripe("pk_test_51PBhqlSETjaFvg1C2PsbTZiSGnIIJwGnqeybHBOguEOfSbcYi9ZkodmeTX0scERgdSL562SntMSRBVL98FWYDaZ500JUw1IXea");
    
    const body = {
      product: {
        currency: "INR",
        product_data: {
          name: "this one",
        },
        unit: 1,
      },
    };

    const response = await axios.post("http://localhost:8080/api/contest/makepayment", body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response);

    if (response.status !=200) {
      throw new Error("Failed to make payment");
    }

    const sessionId = response.data.id;
    const result = await stripe.redirectToCheckout({
      sessionId: sessionId,
    });

    if (result.error) {
      console.log("error in payment", result.error);
      throw new Error(result.error.message);
    }
  } catch (err) {
    console.error("Payment error:", err);
    // Handle error as needed, e.g., show a message to the user
  }
};


