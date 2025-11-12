import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const PAYOS_ORDER_URL = import.meta.env.REACT_APP_ORDER_URL || 'http://localhost:3000';

export async function createPaymentLink(orderData) {
  try {
    const res = await axios({
      method: "POST",
      url: `${PAYOS_ORDER_URL}/api/payos/create-payment-link`,
      data: orderData,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error('PayOS create payment link error:', error);
    return error.response?.data || { error: 'Failed to create payment link' };
  }
}

export async function createOrder(orderData) {
  try {
    const res = await axios({
      method: "POST",
      url: `${API_BASE_URL}/orders`,
      data: orderData,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
    });
    return res.data;
  } catch (error) {
    console.error('Create order error:', error);
    return error.response?.data || { error: 'Failed to create order' };
  }
}

export async function getListBank(){
    try {
        const res = await axios({
          method: "GET",
          url: `${import.meta.env.REACT_APP_LISTS_BANK_URL || 'https://api.vietqr.io/v2/banks'}`,
          headers: {
            "Content-Type": "application/json",
          },
        });
        return res.data;
      } catch (error) {
        console.error('Get banks error:', error);
        return error.response?.data || { error: 'Failed to get banks' };
      }
}
export async function getPayOSOrder(orderId){
  try {
      const res = await axios({
        method: "GET",
        url: `${PAYOS_ORDER_URL}/api/payos/order/${orderId}`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (error) {
      console.error('Get PayOS order error:', error);
      return error.response?.data || { error: 'Failed to get order' };
    }
}

export async function cancelPayOSOrder(orderId){
  try {
      const res = await axios({
        method: "POST",
        url: `${PAYOS_ORDER_URL}/api/payos/cancel/${orderId}`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (error) {
      console.error('Cancel PayOS order error:', error);
      return error.response?.data || { error: 'Failed to cancel order' };
    }
}

export async function verifyPayOSWebhook(webhookData) {
  try {
    const res = await axios({
      method: "POST",
      url: `${PAYOS_ORDER_URL}/api/payos/webhook`,
      data: webhookData,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error('Verify PayOS webhook error:', error);
    return error.response?.data || { error: 'Failed to verify webhook' };
  }
}

