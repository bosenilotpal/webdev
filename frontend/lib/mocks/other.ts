import { PaymentMethod, User } from '../types';

export const mockPaymentMethods: PaymentMethod[] = [
    {
        id: '1',
        name: 'PayPal',
        type: 'paypal',
    },
    {
        id: '2',
        name: 'VISA',
        type: 'visa',
    },
];

export const mockUser: User = {
    id: '1',
    email: 'owner@fitness.com',
    name: 'Gym Owner',
    role: 'gym_owner',
};

export const advertisementSubscription = {
    rate: 5,
    duration: 30,
    paymentLink: 'https://fitnessclub.com',
    qrCode: 'https://fitnessclub.com',
};
