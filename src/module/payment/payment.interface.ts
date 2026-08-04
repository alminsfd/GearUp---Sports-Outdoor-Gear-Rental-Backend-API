

export interface ICreatePaymentPayload {
     rentalOrderId: string;
}

export interface ISSLCommerzCallbackPayload {
     tran_id: string;
     val_id: string;
     amount: string;
     status: string;
     bank_tran_id?: string;
     store_amount?: string;
     card_type?: string;
}