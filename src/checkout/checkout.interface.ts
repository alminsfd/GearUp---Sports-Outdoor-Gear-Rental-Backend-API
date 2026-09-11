export interface IShippingAddress {
     fullName: string;
     phoneNumber: string;
     streetAddress: string;
     city: string;
     area: string;
}

export interface ICreateCheckoutPayload {
     rentalOrderId: string;
     totalAmount: number;
     paymentMethod: 'SSLCOMMERZ';
     shippingAddress: IShippingAddress;
     orderNote?: string;
}