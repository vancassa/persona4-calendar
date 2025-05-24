import type { DataType } from './types';

// Initial data for the application
export const initialData: DataType = {
  activities: [
    {
      date: '2025-05-24',
      timeOfDay: 'Morning',
      activity: 'Comifuro',
      activityType: 'Social',
      details: 'Comic Frontier XX',
      weather: 'Rainy',
    },
    {
      date: '2025-05-24',
      timeOfDay: 'Afternoon',
      activity: 'Comifuro',
      activityType: 'Social',
      details: 'Comic Frontier XX',
      weather: 'Rainy',
    },
    {
      date: '2025-05-24',
      timeOfDay: 'Evening',
      activity: 'Work',
      activityType: 'Work',
      details: '',
      weather: 'Rainy',
    },
  ],
  stats: {
    Knowledge: 2,
    Expression: 1,
    Diligence: 3,
    Understanding: 2,
    Courage: 1,
  },
};
