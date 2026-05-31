import { Plan } from '../types';

export const mockPlans: Plan[] = [
    {
        id: '1',
        name: 'Bronze',
        duration: '3 Months',
        price: 300,
        description: 'Perfect for beginners starting their fitness journey',
        features: ['Access to gym floor', 'Locker room access', 'Basic equipment use', 'Mobile app access'],
    },
    {
        id: '2',
        name: 'Silver',
        duration: '6 Months',
        price: 500,
        description: 'Great value for committed fitness enthusiasts',
        features: ['All Bronze benefits', 'Group fitness classes', 'Nutrition consultation', '10% discount on merchandise'],
    },
    {
        id: '3',
        name: 'Gold',
        duration: '9 Months',
        price: 750,
        description: 'Premium membership with enhanced benefits',
        features: ['All Silver benefits', 'Personal training session (monthly)', 'Guest passes (2/month)', 'Priority class booking'],
    },
    {
        id: '4',
        name: 'Diamond',
        duration: '1 Year',
        price: 999,
        description: 'Ultimate fitness package for serious athletes',
        features: ['All Gold benefits', 'Unlimited guest passes', 'Spa & sauna access', 'VIP locker', 'Free parking'],
    },
    {
        id: '5',
        name: 'Life Membership',
        duration: 'Unlimited',
        price: 3000,
        description: 'One-time investment for lifetime fitness access',
        features: ['All Diamond benefits', 'Lifetime access', 'Priority support', 'Exclusive events', 'Family add-on discount'],
    },
];
