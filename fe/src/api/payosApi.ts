import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888/api';
const PAYOS_ORDER_URL = import.meta.env.REACT_APP_ORDER_URL || 'http://localhost:8888';

export interface PaymentLinkRequest {
  orderCode?: string;
  amount?: number;
  description?: string;
  returnUrl?: string;
  cancelUrl?: string;
  items?: Array<{
    name?: string;
    quantity?: number;
    price?: number;
  }>;
}

export interface PaymentLinkResponse {
  checkoutUrl: string;
  qrCode: string;
  paymentLinkId: string;
  orderCode: number;
  accountNumber?: string;
  accountName?: string;
  bin?: string;
}

export interface OrderData {
  [key: string]: any;
}

export async function createPaymentLink(orderData: PaymentLinkRequest) {
  try {
    const res = await axios({
      method: "POST",
      url: `${API_BASE_URL}/payos/create-payment-link`,
      data: orderData,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
    });
    return res.data;
  } catch (error: any) {
    console.error('PayOS create payment link error:', error);
    return error.response?.data || { error: 'Failed to create payment link' };
  }
}

export async function createOrder(orderData: OrderData) {
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
  } catch (error: any) {
    console.error('Create order error:', error);
    return error.response?.data || { error: 'Failed to create order' };
  }
}

export async function getListBank(){
    try {
        const res = await axios({
          method: "GET",
          url: `${API_BASE_URL}/payos/banks`,
          headers: {
            "Content-Type": "application/json",
          },
        });
        return res.data;
      } catch (error: any) {
        console.error('Get banks error:', error);
        return error.response?.data || { error: 'Failed to get banks' };
      }
}

export async function getPayOSOrder(orderId: string){
  try {
      const res = await axios({
        method: "GET",
        url: `${API_BASE_URL}/payos/order/${orderId}`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
      });
      return res.data;
    } catch (error: any) {
      console.error('Get PayOS order error:', error);
      return error.response?.data || { error: 'Failed to get order' };
    }
}

export async function cancelPayOSOrder(orderId: string){
  try {
      const res = await axios({
        method: "POST",
        url: `${API_BASE_URL}/payos/cancel/${orderId}`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
      });
      return res.data;
    } catch (error: any) {
      console.error('Cancel PayOS order error:', error);
      return error.response?.data || { error: 'Failed to cancel order' };
    }
}

export async function verifyPayOSWebhook(webhookData: any) {
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
  } catch (error: any) {
    console.error('Verify PayOS webhook error:', error);
    return error.response?.data || { error: 'Failed to verify webhook' };
  }
}
