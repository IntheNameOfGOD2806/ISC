import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Result, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { getPayOSOrder } from '@/api/payosApi';

const PaymentResultPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'cancelled' | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const orderCode = searchParams.get('orderCode');
      const status = searchParams.get('status');
      
      if (!orderCode) {
        setPaymentStatus('failed');
        setLoading(false);
        return;
      }

      try {
        // Check with PayOS API
        const response = await getPayOSOrder(orderCode);
        
        if (response.data) {
          setOrderData(response.data);
          
          // Map PayOS status to our status
          switch (response.data.status) {
            case 'PAID':
              setPaymentStatus('success');
              break;
            case 'CANCELLED':
              setPaymentStatus('cancelled');
              break;
            case 'EXPIRED':
            case 'FAILED':
              setPaymentStatus('failed');
              break;
            default:
              // If status from URL params
              if (status === 'PAID') {
                setPaymentStatus('success');
              } else if (status === 'CANCELLED') {
                setPaymentStatus('cancelled');
              } else {
                setPaymentStatus('failed');
              }
          }
        } else {
          // Fallback to URL params
          if (status === 'PAID') {
            setPaymentStatus('success');
          } else if (status === 'CANCELLED') {
            setPaymentStatus('cancelled');
          } else {
            setPaymentStatus('failed');
          }
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setPaymentStatus('failed');
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  const handleGoToOrders = () => {
    navigate('/orders');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleTryAgain = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spin 
            indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} 
            size="large" 
          />
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            Đang kiểm tra trạng thái thanh toán...
          </p>
        </div>
      </div>
    );
  }

  const renderResult = () => {
    switch (paymentStatus) {
      case 'success':
        return (
          <Result
            icon={<CheckCircleOutlined className="text-green-500" />}
            title="Thanh toán thành công!"
            subTitle={
              <div className="space-y-2">
                <p>Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đang được xử lý.</p>
                {orderData && (
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    <p>Mã đơn hàng: <span className="font-mono font-semibold">{orderData.orderCode}</span></p>
                    {orderData.amount && (
                      <p>Số tiền: <span className="font-semibold">{orderData.amount.toLocaleString('vi-VN')} VND</span></p>
                    )}
                  </div>
                )}
              </div>
            }
            extra={[
              <Button type="primary" key="orders" onClick={handleGoToOrders}>
                Xem đơn hàng
              </Button>,
              <Button key="home" onClick={handleGoHome}>
                Về trang chủ
              </Button>,
            ]}
          />
        );

      case 'cancelled':
        return (
          <Result
            icon={<CloseCircleOutlined className="text-orange-500" />}
            title="Thanh toán đã bị hủy"
            subTitle="Bạn đã hủy thanh toán. Bạn có thể thử lại hoặc chọn phương thức thanh toán khác."
            extra={[
              <Button type="primary" key="retry" onClick={handleTryAgain}>
                Thử lại
              </Button>,
              <Button key="home" onClick={handleGoHome}>
                Về trang chủ
              </Button>,
            ]}
          />
        );

      case 'failed':
      default:
        return (
          <Result
            icon={<CloseCircleOutlined className="text-red-500" />}
            title="Thanh toán thất bại"
            subTitle="Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ."
            extra={[
              <Button type="primary" key="retry" onClick={handleTryAgain}>
                Thử lại
              </Button>,
              <Button key="home" onClick={handleGoHome}>
                Về trang chủ
              </Button>,
            ]}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {renderResult()}
        </div>
      </div>
    </div>
  );
};

export default PaymentResultPage;
