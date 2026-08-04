declare module "sslcommerz-lts" {
     class SSLCommerzPayment {
          constructor(store_id: string, store_passwd: string, is_live: boolean);
          init(data: any): Promise<{ GatewayPageURL?: string; status?: string }>;
          validate(data: { val_id: string }): Promise<any>;
          initiateTransaction(data: any): Promise<any>;
     }
     export default SSLCommerzPayment;
}