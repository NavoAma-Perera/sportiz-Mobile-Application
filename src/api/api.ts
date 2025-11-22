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
    '/eventsnextleague.php?id=4387', // NBA - Basketball
    '/eventsnextleague.php?id=4424', // ATP - Tennis
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

  // Add swimming events manually
  const swimmingEvents: RawEvent[] = [
    {
      idEvent: 'swim1001',
      strEvent: 'FINA World Cup - Singapore',
      strHomeTeam: 'Team USA',
      strAwayTeam: 'Team Australia',
      strSport: 'Swimming',
      strLeague: 'FINA World Cup',
      dateEvent: '2025-11-22',
      strTime: '10:00:00',
      strThumb: 'https://images.unsplash.com/photo-1544551762-8cba1245e20c?w=800',
    },
    {
      idEvent: 'swim1002',
      strEvent: 'National Swimming Championship',
      strHomeTeam: 'Michael Phelps Team',
      strAwayTeam: 'Katie Ledecky Team',
      strSport: 'Swimming',
      strLeague: 'National Championship',
      dateEvent: '2025-12-05',
      strTime: '09:00:00',
      strThumb: 'https://images.unsplash.com/photo-1575058752200-a9d6c0f41945?w=800',
    },
    {
      idEvent: 'swim1003',
      strEvent: 'Olympic Trials - 100m Freestyle',
      strHomeTeam: 'Team Europe',
      strAwayTeam: 'Team Asia',
      strSport: 'Swimming',
      strLeague: 'Olympic Trials',
      dateEvent: '2025-11-25',
      strTime: '14:30:00',
      strThumb: 'https://images.unsplash.com/photo-1560089000-7433a4ebbd64?w=800',
    },
  ];

  // Add volleyball events manually
  const volleyballEvents: RawEvent[] = [
    {
      idEvent: 'vball1001',
      strEvent: 'FIVB World Championship',
      strHomeTeam: 'Brazil',
      strAwayTeam: 'Poland',
      strSport: 'Volleyball',
      strLeague: 'FIVB World Championship',
      dateEvent: '2025-11-23',
      strTime: '18:00:00',
      strThumb: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
    },
    {
      idEvent: 'vball1002',
      strEvent: 'Nations League Finals',
      strHomeTeam: 'USA',
      strAwayTeam: 'Italy',
      strSport: 'Volleyball',
      strLeague: 'VNL',
      dateEvent: '2025-11-28',
      strTime: '19:30:00',
      strThumb: 'https://images.unsplash.com/photo-1593786481097-6e6d87f1a38b?w=800',
    },
    {
      idEvent: 'vball1003',
      strEvent: 'Beach Volleyball Championship',
      strHomeTeam: 'Russia',
      strAwayTeam: 'Germany',
      strSport: 'Volleyball',
      strLeague: 'Beach Volleyball Tour',
      dateEvent: '2025-12-01',
      strTime: '16:00:00',
      strThumb: 'https://images.unsplash.com/photo-1592656094267-764a45160876?w=800',
    },
  ];

  // Add baseball events manually
  const baseballEvents: RawEvent[] = [
    {
      idEvent: 'base1001',
      strEvent: 'World Series Game 1',
      strHomeTeam: 'New York Yankees',
      strAwayTeam: 'Los Angeles Dodgers',
      strSport: 'Baseball',
      strLeague: 'MLB World Series',
      dateEvent: '2025-11-24',
      strTime: '20:00:00',
      strThumb: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800',
    },
    {
      idEvent: 'base1002',
      strEvent: 'Championship Series',
      strHomeTeam: 'Boston Red Sox',
      strAwayTeam: 'Houston Astros',
      strSport: 'Baseball',
      strLeague: 'MLB',
      dateEvent: '2025-11-30',
      strTime: '19:00:00',
      strThumb: 'https://images.unsplash.com/photo-1508969971877-b08e82b07bd8?w=800',
    },
  ];

  // Add rugby events manually
  const rugbyEvents: RawEvent[] = [
    {
      idEvent: 'rugby1001',
      strEvent: 'Six Nations Championship',
      strHomeTeam: 'England',
      strAwayTeam: 'New Zealand',
      strSport: 'Rugby',
      strLeague: 'Six Nations',
      dateEvent: '2025-11-26',
      strTime: '15:00:00',
      strThumb: 'https://images.unsplash.com/photo-1487466365202-1afdb86c764e?w=800',
    },
    {
      idEvent: 'rugby1002',
      strEvent: 'Rugby World Cup Qualifier',
      strHomeTeam: 'South Africa',
      strAwayTeam: 'Australia',
      strSport: 'Rugby',
      strLeague: 'World Cup Qualifiers',
      dateEvent: '2025-12-03',
      strTime: '17:30:00',
      strThumb: 'https://images.unsplash.com/photo-1550082756-be6dd8e8a2f8?w=800',
    },
  ];

  events.push(...swimmingEvents, ...volleyballEvents, ...baseballEvents, ...rugbyEvents);
  return events;
};