import { Reward } from './types';
import { HealthySnackCoLogo, FitZoneGymLogo, TechTrackFitnessLogo } from './components/PartnerIcons';

export const REWARDS: Reward[] = [
  {
    id: 'snack10',
    partnerName: 'Healthy Snack Co.',
    partnerLogo: HealthySnackCoLogo,
    title: '10% Off Healthy Snacks',
    description: 'Get a 10% discount on your next order of delicious, guilt-free snacks.',
    pointsRequired: 500,
    rewardValue: 'SNACK10',
  },
  {
    id: 'gympass',
    partnerName: 'FitZone Gym',
    partnerLogo: FitZoneGymLogo,
    title: 'Free Gym Day Pass',
    description: 'Enjoy a complimentary day pass to any FitZone Gym location to kickstart your fitness.',
    pointsRequired: 2000,
    rewardValue: 'Claim at any FitZone front desk',
  },
  {
    id: 'tracker25',
    partnerName: 'TechTrack Fitness',
    partnerLogo: TechTrackFitnessLogo,
    title: '$25 Off Fitness Tracker',
    description: 'Get a significant $25 discount on the latest TechTrack fitness tracker.',
    pointsRequired: 10000,
    rewardValue: 'TECH25OFF',
  },
];
