# PayOS Integration Guide

## Tổng quan
PayOS là một giải pháp thanh toán trực tuyến cho phép khách hàng thanh toán qua chuyển khoản ngân hàng với mã QR. Tích hợp này cho phép người dùng thanh toán đơn hàng một cách an toàn và tiện lợi.

## Cấu hình

### 1. Environment Variables
Thêm các biến môi trường sau vào file `.env`:

```env
# PayOS Configuration
VITE_PAYOS_CLIENT_ID=your_payos_client_id
VITE_PAYOS_API_KEY=your_payos_api_key
VITE_PAYOS_CHECKSUM_KEY=your_payos_checksum_key
REACT_APP_ORDER_URL=http://isc-p4t8.onrender.com
REACT_APP_LISTS_BANK_URL=https://api.vietqr.io/v2/banks
```

### 2. Lấy PayOS Credentials
1. Đăng ký tài khoản tại [PayOS](https://payos.vn)
2. Tạo ứng dụng mới
3. Lấy `Client ID`, `API Key`, và `Checksum Key`
4. Cập nhật vào file `.env`

## Cấu trúc tích hợp

### 1. API Service (`src/api/payosApi.ts`)
- `createPaymentLink()`: Tạo link thanh toán PayOS
- `getPayOSOrder()`: Lấy thông tin đơn hàng
- `cancelPayOSOrder()`: Hủy đơn hàng
- `verifyPayOSWebhook()`: Xác thực webhook

### 2. Payment Component (`src/components/payment/PayOSPayment.tsx`)
- Hiển thị giao diện thanh toán PayOS
- Tạo và hiển thị mã QR
- Polling trạng thái thanh toán
- Xử lý các trạng thái thanh toán khác nhau

### 3. Result Page (`src/pages/PaymentResultPage.tsx`)
- Hiển thị kết quả thanh toán
- Xử lý redirect từ PayOS
- Cập nhật trạng thái đơn hàng

### 4. Checkout Integration (`src/pages/CheckoutPage.tsx`)
- Thêm PayOS làm phương thức thanh toán
- Tích hợp vào flow checkout hiện tại

## Luồng thanh toán

1. **Khởi tạo**: Người dùng chọn PayOS làm phương thức thanh toán
2. **Tạo đơn hàng**: Tạo đơn hàng trong hệ thống
3. **Tạo payment link**: Gọi API PayOS để tạo link thanh toán
4. **Hiển thị QR**: Hiển thị mã QR và thông tin chuyển khoản
5. **Polling**: Kiểm tra trạng thái thanh toán định kỳ
6. **Xử lý kết quả**: Cập nhật trạng thái đơn hàng dựa trên kết quả

## Routes được thêm

```typescript
// Payment result pages
<Route path="checkout/success" element={<PaymentResultPage />} />
<Route path="checkout/cancel" element={<PaymentResultPage />} />
```

## Trạng thái thanh toán

- `PENDING`: Đang chờ thanh toán
- `PROCESSING`: Đang xử lý thanh toán  
- `PAID`: Đã thanh toán thành công
- `CANCELLED`: Đã hủy thanh toán
- `EXPIRED`: Link thanh toán đã hết hạn
- `FAILED`: Thanh toán thất bại

## Backend Requirements

Backend cần implement các endpoint sau:

### 1. Create Payment Link
```
POST /api/payos/create-payment-link
Body: {
  orderCode: number,
  amount: number,
  description: string,
  returnUrl: string,
  cancelUrl: string,
  items: Array<{name: string, quantity: number, price: number}>
}
```

### 2. Get Order Status
```
GET /api/payos/order/:orderId
Response: {
  data: {
    orderCode: number,
    status: string,
    amount: number,
    ...
  }
}
```

### 3. Cancel Order
```
POST /api/payos/cancel/:orderId
```

### 4. Webhook Handler
```
POST /api/payos/webhook
Body: PayOS webhook data
```

## Bảo mật

1. **Checksum verification**: Xác thực tính toàn vẹn dữ liệu
2. **HTTPS**: Sử dụng HTTPS cho tất cả API calls
3. **Environment variables**: Không hardcode credentials
4. **Webhook verification**: Xác thực webhook từ PayOS

## Testing

### 1. Test Environment
- Sử dụng PayOS sandbox environment
- Test với số tiền nhỏ
- Kiểm tra tất cả trạng thái thanh toán

### 2. Test Cases
- Thanh toán thành công
- Thanh toán bị hủy
- Thanh toán hết hạn
- Mất kết nối mạng
- Webhook handling

## Troubleshooting

### 1. Lỗi thường gặp
- **Invalid credentials**: Kiểm tra PayOS credentials
- **Network timeout**: Tăng timeout cho API calls
- **Webhook not received**: Kiểm tra URL và firewall

### 2. Debug
- Kiểm tra console logs
- Verify API responses
- Test webhook endpoints

## Monitoring

1. **Payment success rate**: Theo dõi tỷ lệ thanh toán thành công
2. **Response time**: Thời gian phản hồi API
3. **Error rates**: Tỷ lệ lỗi theo từng endpoint
4. **Webhook delivery**: Tỷ lệ webhook được nhận thành công

## Support

- PayOS Documentation: [https://payos.vn/docs](https://payos.vn/docs)
- PayOS Support: support@payos.vn
- Internal Documentation: Xem thêm trong `/docs` folder
