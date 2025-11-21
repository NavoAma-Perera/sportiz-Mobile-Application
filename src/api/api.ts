// src/api/api.ts
const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

export interface RawEvent {
  idEvent: string;
  strEvent: string;
  strHomeTeam?: string;
  strAwayTeam?: string;
  strSport: string;
  strLeague?: string;
  dateEvent: string;
  strTime?: string;
  strThumb?: string;
}

export const getAllUpcomingEvents = async (): Promise<RawEvent[]> => {
  const endpoints = [
    '/eventsnextleague.php?id=4328', // Premier League - Football
    '/eventsnextleague.php?id=4444', // IPL - Cricket
    '/eventsnextleague.php?id=4480', // Swimming World Cup (limited)
  ];

  let events: RawEvent[] = [];

  for (const ep of endpoints) {
    try {
      const res = await fetch(`${BASE_URL}${ep}`);
      const data = await res.json();
      if (data.events) events.push(...data.events);
    } catch (err) {
      console.log('Failed endpoint:', ep);
    }
  }

  // Add some swimming events manually (API has few)
  const swimmingExtras: RawEvent[] = [
    {
      idEvent: 'swim1001',
      strEvent: 'FINA World Cup - Singapore',
      strSport: 'Swimming',
      strLeague: 'FINA World Cup',
      dateEvent: '2025-11-22',
      strTime: '10:00:00',
      strThumb: 'https://images.unsplash.com/photo-1544551762-8cba1245e20c?w=800',
    },
    {
      idEvent: 'swim1002',
      strEvent: 'National Swimming Championship',
      strSport: 'Swimming',
      strLeague: 'National',
      dateEvent: '2025-12-05',
      strTime: '09:00:00',
      strThumb: 'https://images.unsplash.com/photo-1575058752200-a9d6c0f41945?w=800',
    },
  ];

  events.push(...swimmingExtras);
  return events;
};