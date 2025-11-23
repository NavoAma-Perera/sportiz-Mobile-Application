
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
  const endpoints = [
    '/eventsnextleague.php?id=4328', 
    '/eventsnextleague.php?id=4329', 
    '/eventsnextleague.php?id=4335', 
    '/eventsnextleague.php?id=4331', 
    '/eventsnextleague.php?id=4332',
    '/eventsnextleague.php?id=4334', 
    '/eventsnextleague.php?id=4346', 
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

// Fetch event info
export const fetchEventDetails = async (eventId: string) => {
  try {
    const res = await fetch(`${BASE_URL_V1}/lookupevent.php?id=${eventId}`);
    const data = await res.json();
    return data.events?.[0] || null;
  } catch (err) {
    console.log('Error fetching event details:', err);
    return null;
  }
};

export const fetchLeagueDetails = async (leagueId: string) => {
  try {
    const res = await fetch(`${BASE_URL_V1}/lookupleague.php?id=${leagueId}`);
    const data = await res.json();
    return data.leagues?.[0] || null;
  } catch (err) {
    console.log('Error fetching league details:', err);
    return null;
  }
};

export const fetchTeamDetails = async (teamId: string) => {
  try {
    const res = await fetch(`${BASE_URL_V1}/lookupteam.php?id=${teamId}`);
    const data = await res.json();
    return data.teams?.[0] || null;
  } catch (err) {
    console.log('Error fetching team details:', err);
    return null;
  }
};

export const fetchTeamPlayers = async (teamId: string) => {
  try {
    const res = await fetch(`${BASE_URL_V1}/lookup_all_players.php?id=${teamId}`);
    const data = await res.json();
    return data.player || [];
  } catch (err) {
    console.log('Error fetching team players:', err);
    return [];
  }
};

export const fetchEventStats = async (eventId: string) => {
  try {
    const res = await fetch(`${BASE_URL_V1}/eventstats.php?id=${eventId}`);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.log('Error fetching stats:', err);
    return [];
  }
};