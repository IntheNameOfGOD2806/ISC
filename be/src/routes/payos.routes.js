const express = require('express');
const router = express.Router();
const payosService = require('../services/payos.service');
const { authenticate } = require('../middlewares/authenticate');

// Create payment link (authenticated)
router.post('/create-payment-link', authenticate, async (req, res) => {
  try {
    const {
      orderCode,
      amount,
      description,
      returnUrl,
      cancelUrl,
      items
    } = req.body;

    // Validate required fields
    if (!orderCode || !amount) {
      return res.status(400).json({
        status: 'error',
        message: 'orderCode and amount are required'
      });
    }

    const result = await payosService.createPaymentLink({
      orderCode,
      amount,
      description,
      returnUrl,
      cancelUrl,
      items
    });

    if (result.success) {
      res.status(200).json({
        status: 'success',
        data: result.data
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Failed to create payment link',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Create payment link error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get payment info (authenticated)
router.get('/order/:orderCode', authenticate, async (req, res) => {
  try {
    const { orderCode } = req.params;

    const result = await payosService.getPaymentInfo(orderCode);

    if (result.success) {
      res.status(200).json({
        status: 'success',
        data: result.data
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Failed to get payment info',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Get payment info error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Cancel payment (authenticated)
router.post('/cancel/:orderCode', authenticate, async (req, res) => {
  try {
    const { orderCode } = req.params;
    const { cancellationReason } = req.body;

    const result = await payosService.cancelPayment(orderCode, cancellationReason);

    if (result.success) {
      res.status(200).json({
        status: 'success',
        data: result.data
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Failed to cancel payment',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Cancel payment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get bank list (public)
router.get('/banks', async (req, res) => {
  try {
    const result = await payosService.getBankList();

    if (result.success) {
      res.status(200).json({
        status: 'success',
        data: result.data
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Failed to get bank list',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Get bank list error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;
