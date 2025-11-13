import React, { useState, useEffect } from 'react';
import { Button, Modal, message } from 'antd';
import { LoadingOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import QRCode from 'qrcode.react';
import { createPaymentLink, getPayOSOrder, cancelPayOSOrder } from '@/api/payosApi';
import { formatPrice } from '@/utils/format';

interface PayOSPaymentProps {
  orderId: string;
  amount: number;
  productName: string;
  description: string;
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
  onCancel?: () => void;
}

interface PaymentLinkData {
  data: {
    checkoutUrl: string;
    qrCode: string;
    paymentLinkId: string;
    orderCode: number;
    accountNumber?: string;
    accountName?: string;
    bin?: string;
  }
}

const PayOSPayment: React.FC<PayOSPaymentProps> = ({
  orderId: _orderId, // Keep for interface compatibility but don't use
  amount,
  productName,
  description,  
  onSuccess,
  onError,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentLinkData | null>(null);
  console.log('paymentData', paymentData);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed' | 'cancelled'>('pending');
  const [showQRModal, setShowQRModal] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const createPayment = async () => {
    setLoading(true);
    try {
      // Generate orderCode first
      const orderCode = Math.floor(Math.random() * 1000000);
      
      const body = {
        orderCode: orderCode,
        description: description,
        // orderId: orderId,
        amount: 2000,
        // productName: productName,
        // price: Number(amount),
        // items: [
        //   {
        //     name: productName,
        //     quantity: 1,
        //     price: amount
        //   }
        // ],
        returnUrl: import.meta.env.VITE_RETURN_URL || `${window.location.origin}/checkout/success?orderCode=${orderCode}`,
        cancelUrl: import.meta.env.VITE_CANCEL_URL || `${window.location.origin}/checkout/cancel?orderCode=${orderCode}`,
      };

      console.log('PayOS Payment Body:', body);
      console.log('Environment Variables:', {
        VITE_RETURN_URL: import.meta.env.VITE_RETURN_URL,
        VITE_CANCEL_URL: import.meta.env.VITE_CANCEL_URL,
        REACT_APP_RETURN_URL: import.meta.env.REACT_APP_RETURN_URL,
        REACT_APP_CANCEL_URL: import.meta.env.REACT_APP_CANCEL_URL,
      });

      const response = await createPaymentLink(body);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setPaymentData(response.data);
        setPaymentStatus('processing');
        
        // Store orderCode in localStorage for later use in PaymentResultPage
        localStorage.setItem('orderCode', body.orderCode.toString());
        console.log('Stored orderCode in localStorage:', body.orderCode);
        
        startPolling(response.data.orderCode);
        message.success('Đã tạo link thanh toán thành công!');
      } else {
        throw new Error('Không nhận được dữ liệu thanh toán');
      }
    } catch (error) {
      console.error('Create payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Không thể tạo link thanh toán';
      onError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (orderCode: string) => {
    const interval = setInterval(async () => {
      try {
        const orderStatus = await getPayOSOrder(orderCode);
        
        if (orderStatus.data) {
          const status = orderStatus.data.status;
          
          if (status === 'PAID') {
            setPaymentStatus('success');
            clearInterval(interval);
            setPollingInterval(null);
            onSuccess(orderStatus.data);
            message.success('Thanh toán thành công!');
          } else if (status === 'CANCELLED') {
            setPaymentStatus('cancelled');
            clearInterval(interval);
            setPollingInterval(null);
            onError('Thanh toán đã bị hủy');
          } else if (status === 'EXPIRED') {
            setPaymentStatus('failed');
            clearInterval(interval);
            setPollingInterval(null);
            onError('Link thanh toán đã hết hạn');
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000); // Poll every 3 seconds

    setPollingInterval(interval);

    // Stop polling after 10 minutes
    setTimeout(() => {
      clearInterval(interval);
      setPollingInterval(null);
      if (paymentStatus === 'processing') {
        setPaymentStatus('failed');
        onError('Timeout: Vui lòng kiểm tra lại trạng thái thanh toán');
      }
    }, 600000);
  };

  const handleCancel = async () => {
    if (paymentData?.data?.orderCode) {
      try {
        await cancelPayOSOrder(paymentData.data.orderCode.toString());
        setPaymentStatus('cancelled');
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
        onCancel?.();
        message.info('Đã hủy thanh toán');
      } catch (error) {
        console.error('Cancel payment error:', error);
        message.error('Không thể hủy thanh toán');
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Đã sao chép!');
  };

  const openPaymentLink = () => {
    if (paymentData?.data?.checkoutUrl) {
      // alert(234244)
      window.open(paymentData.data.checkoutUrl, '_blank');
    }
  };

  const renderPaymentStatus = () => {
    switch (paymentStatus) {
      case 'success':
        return (
          <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircleOutlined className="text-4xl text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
              Thanh toán thành công!
            </h3>
            <p className="text-green-600 dark:text-green-300">
              Đơn hàng của bạn đã được thanh toán thành công.
            </p>
          </div>
        );
      
      case 'failed':
      case 'cancelled':
        return (
          <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <ExclamationCircleOutlined className="text-4xl text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              {paymentStatus === 'cancelled' ? 'Thanh toán đã bị hủy' : 'Thanh toán thất bại'}
            </h3>
            <p className="text-red-600 dark:text-red-300">
              {paymentStatus === 'cancelled' 
                ? 'Bạn đã hủy thanh toán.' 
                : 'Có lỗi xảy ra trong quá trình thanh toán.'}
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (paymentStatus === 'success' || paymentStatus === 'failed' || paymentStatus === 'cancelled') {
    return renderPaymentStatus();
  }

  return (
    <div className="space-y-6">
      {!paymentData ? (
        <div className="text-center">
          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={createPayment}
            className="h-12 px-8 text-lg font-semibold"
          >
            {loading ? 'Đang tạo thanh toán...' : 'Tạo thanh toán PayOS'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Payment Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Thông tin thanh toán
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-600 dark:text-blue-300">Mã đơn hàng:</span>
                <span className="font-mono font-semibold">{paymentData.data.orderCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600 dark:text-blue-300">Số tiền:</span>
                <span className="font-semibold text-red-600">{formatPrice(amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600 dark:text-blue-300">Trạng thái:</span>
                <span className="flex items-center gap-2">
                  <LoadingOutlined className="text-orange-500" />
                  <span className="text-orange-600">Đang chờ thanh toán</span>
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          {paymentData.data.qrCode && (
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
                <QRCode
                  value={paymentData.data.qrCode}
                  size={200}
                  level="M"
                  includeMargin={true}
                />
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                Quét mã QR để thanh toán
              </p>
            </div>
          )}

          {/* Bank Transfer Info */}
          {paymentData.data.accountNumber && (
            <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg space-y-3">
              <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
                Thông tin chuyển khoản
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Số tài khoản:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold">{paymentData.data.accountNumber}</span>
                    <Button 
                      size="small" 
                      onClick={() => copyToClipboard(paymentData.data.accountNumber!)}
                    >
                      Sao chép
                    </Button>
                  </div>
                </div>
                {paymentData.data.accountName && (
                  <div className="flex justify-between">
                    <span>Chủ tài khoản:</span>
                    <span className="font-semibold">{paymentData.data.accountName}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              type="primary"
              size="large"
              onClick={openPaymentLink}
              className="flex-1 max-w-xs h-12"
            >
              Mở trang thanh toán
            </Button>
            <Button
              size="large"
              onClick={() => setShowQRModal(true)}
              className="h-12"
            >
              Xem QR Code
            </Button>
            <Button
              danger
              size="large"
              onClick={handleCancel}
              className="h-12"
            >
              Hủy thanh toán
            </Button>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      <Modal
        title="Mã QR Thanh toán"
        open={showQRModal}
        onCancel={() => setShowQRModal(false)}
        footer={null}
        centered
      >
        {paymentData?.data?.qrCode && (
          <div className="text-center p-4">
            <div className="bg-white p-6 rounded-lg inline-block">
              <QRCode
                value={paymentData.data.qrCode}
                size={300}
                level="M"
                includeMargin={true}
              />
            </div>
            <p className="text-sm text-neutral-600 mt-4">
              Sử dụng ứng dụng ngân hàng để quét mã QR này
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PayOSPayment;
