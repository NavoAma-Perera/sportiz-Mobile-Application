// src/api/api.ts
const BASE_URL_V1 = 'https://www.thesportsdb.com/api/v1/json/3';

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
  idLeague?: string;
  idHomeTeam?: string;
  idAwayTeam?: string;
}

export const getAllUpcomingEvents = async (): Promise<RawEvent[]> => {
  // Using v1 API with multiple football leagues that are confirmed to work
  const endpoints = [
    '/eventsnextleague.php?id=4328', // English Premier League
    '/eventsnextleague.php?id=4329', // English Championship
    '/eventsnextleague.php?id=4335', // Spanish La Liga
    '/eventsnextleague.php?id=4331', // German Bundesliga
    '/eventsnextleague.php?id=4332', // Italian Serie A
    '/eventsnextleague.php?id=4334', // French Ligue 1
    '/eventsnextleague.php?id=4346', // UEFA Champions League
  ];

  let events: RawEvent[] = [];

  for (const ep of endpoints) {
    try {
      const res = await fetch(`${BASE_URL_V1}${ep}`);
      const data = await res.json();
      if (data.events) {
        events.push(...data.events);
      }
    } catch (err) {
      console.log('Failed endpoint:', ep, err);
    }
  }

  return events;
};