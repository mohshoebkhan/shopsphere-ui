export interface Order {

  orderId: number;

  totalAmount: number;

  status: string;

  orderDate: string;

  // Delivery details
  fullName: string;

  mobile: string;

  address: string;

  city: string;

  state: string;

  pincode: string;

  // Payment
  paymentMethod: string;
}

