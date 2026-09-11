import { Router } from 'express';
import { checkoutController } from './checkout.controller';
import { UserRole } from '../../generated/prisma/enums';
import { auth } from '../middleware/auth';

const router = Router();


router.post('/', auth(UserRole.CUSTOMER), checkoutController.createCheckout);


router.get('/:rentalOrderId', checkoutController.getCheckout);

export const checkoutRoutes = router;