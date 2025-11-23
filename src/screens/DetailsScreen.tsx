// src/screens/DetailsScreen.tsx
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import * as Calendar from 'expo-calendar';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFav } from '../features/favourites/favouritesSlice';
import type { RootState, AppDispatch, Match } from '../types';
import { Colors } from '../constants/colors';

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

// Sport-specific configurations
const SPORT_CONFIG: Record<string, any> = {
  Football: {
    stats: ['Possession %', 'Shots', 'Shots on Target', 'Pass Accuracy %', 'Fouls', 'Yellow Cards'],
    descriptions: {
      'Possession %': 'Percentage of time ball is with the team',
      'Shots': 'Total shots attempted on goal',
      'Shots on Target': 'Shots aimed directly at the goal',
      'Pass Accuracy %': 'Percentage of successful passes',
      'Fouls': 'Total fouls committed',
      'Yellow Cards': 'Cautions given to players',
    },
  },
  Basketball: {
    stats: ['Points', 'Rebounds', 'Assists', 'Field Goal %', 'Three Point %', 'Turnovers'],
    descriptions: {
      'Points': 'Total points scored',
      'Rebounds': 'Balls recovered after missed shots',
      'Assists': 'Successful passes leading to scores',
      'Field Goal %': 'Percentage of successful shots',
      'Three Point %': 'Percentage of three-pointers made',
      'Turnovers': 'Possession losses',
    },
  },
  Baseball: {
    stats: ['Hits', 'Home Runs', 'RBIs', 'Batting Avg', 'Strikeouts', 'Stolen Bases'],
    descriptions: {
      'Hits': 'Successful hits on ball',
      'Home Runs': 'Runs scored on single hit',
      'RBIs': 'Runs batted in',
      'Batting Avg': 'Batting average percentage',
      'Strikeouts': 'Batters struck out',
      'Stolen Bases': 'Bases stolen safely',
    },
  },
  Hockey: {
    stats: ['Goals', 'Assists', 'Shots', 'Saves %', 'Penalties', 'Plus/Minus'],
    descriptions: {
      'Goals': 'Goals scored',
      'Assists': 'Players assisting goals',
      'Shots': 'Total shots on goal',
      'Saves %': 'Percentage of saves made',
      'Penalties': 'Penalty minutes',
      'Plus/Minus': 'Plus/minus rating',
    },
  },
  NFL: {
    stats: ['Touchdowns', 'Passing Yards', 'Rushing Yards', 'Interceptions', 'Sacks', 'Turnovers'],
    descriptions: {
      'Touchdowns': 'Touchdowns scored',
      'Passing Yards': 'Total passing yards',
      'Rushing Yards': 'Total rushing yards',
      'Interceptions': 'Passes intercepted',
      'Sacks': 'Quarterback sacks',
      'Turnovers': 'Turnovers forced',
    },
  },
  Rugby: {
    stats: ['Tries', 'Conversions', 'Penalties', 'Scrums Won', 'Tackles', 'Linebreaks'],
    descriptions: {
      'Tries': 'Touch downs scored (5 points each)',
      'Conversions': 'Bonus kicks after tries',
      'Penalties': 'Penalty kicks scored',
      'Scrums Won': 'Successful scrum possessions',
      'Tackles': 'Successful defensive tackles',
      'Linebreaks': 'Times breaking through defense',
    },
  },
  Golf: {
    stats: ['Score', 'Birdies', 'Eagles', 'Pars', 'Bogeys', 'Strokes Gained'],
    descriptions: {
      'Score': 'Total score for the round',
      'Birdies': 'One under par holes',
      'Eagles': 'Two under par holes',
      'Pars': 'Score equal to par',
      'Bogeys': 'One over par holes',
      'Strokes Gained': 'Strokes gained vs field average',
    },
  },
};

const sportIcons: Record<string, string> = {
  Football: '⚽',
  Basketball: '🏀',
  Baseball: '⚾',
  Hockey: '🏒',
  NFL: '🏈',
  Rugby: '🏉',
  Golf: '⛳',
};

type TabType = 'overview' | 'teams' | 'players' | 'stats';

// API functions for fetching detailed data
const fetchEventDetails = async (eventId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/lookupevent.php?id=${eventId}`);
    const data = await res.json();
    return data.results?.[0] || null;
  } catch (err) {
    console.log('Error fetching event details:', err);
    return null;
  }
};

const fetchEventLineup = async (eventId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/eventlineup.php?id=${eventId}`);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.log('Error fetching lineup:', err);
    return [];
  }
};

const fetchEventStats = async (eventId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/eventstats.php?id=${eventId}`);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.log('Error fetching stats:', err);
    return [];
  }
};

const fetchTeamDetails = async (teamId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/lookupteam.php?id=${teamId}`);
    const data = await res.json();
    return data.teams?.[0] || null;
  } catch (err) {
    console.log('Error fetching team details:', err);
    return null;
  }
};

const fetchTeamPlayers = async (teamId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/lookup_all_players.php?id=${teamId}`);
    const data = await res.json();
    return data.player || [];
  } catch (err) {
    console.log('Error fetching team players:', err);
    return [];
  }
};

export default function DetailsScreen({ route, navigation }: { route: any; navigation: any }) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  if (!route?.params?.item) {
    navigation.goBack();
    return null;
  }

  const item: Match = route.params.item;
  const dispatch = useDispatch<AppDispatch>();
  const favs = useSelector((state: RootState) => state.favourites.items);
  const isFav = favs.some((f: Match) => f.id === item.id);
  const isDark = useSelector((state: RootState) => state.favourites.isDark);
  const theme = Colors(isDark);

  const onToggleFav = () => dispatch(toggleFav(item));

  const onShare = async () => {
    try {
      await Share.share({
        message: `${item.teamA} vs ${item.teamB} - ${new Date(item.date).toLocaleString()} on Sportiz!`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share match');
    }
  };
// Replace the onAddToCalendar function in your DetailsScreen.tsx with this:
// Make sure Platform is imported at the top of your file

const getOrCreateCalendar = async (): Promise<Calendar.Calendar | null> => {
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  
  // Try to find existing calendar
  let defaultCalendar = calendars.find((cal) => cal.isPrimary) || 
                       calendars.find((cal) => cal.allowsModifications) ||
                       calendars[0];

  // If no calendar exists, create one (especially for emulator)
  if (!defaultCalendar) {
    try {
      if (Platform.OS === 'ios') {
        // iOS - use default calendar source
        const defaultSource = calendars[0]?.source;
        if (!defaultSource) {
          return null;
        }

        const newCalendarID = await Calendar.createCalendarAsync({
          title: 'Sportiz Matches',
          color: '#007AFF',
          entityType: Calendar.EntityTypes.EVENT,
          sourceId: defaultSource.id,
          source: defaultSource,
          name: 'sportiz_matches',
          ownerAccount: 'personal',
          accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });

        const newCalendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const foundCalendar = newCalendars.find(cal => cal.id === newCalendarID);
        if (foundCalendar) {
          defaultCalendar = foundCalendar;
        }
      } else {
        // Android - create local calendar
        const newCalendarID = await Calendar.createCalendarAsync({
          title: 'Sportiz Matches',
          color: '#007AFF',
          entityType: Calendar.EntityTypes.EVENT,
          source: {
            isLocalAccount: true,
            name: 'Sportiz Calendar',
            type: Calendar.CalendarType.LOCAL,
          },
          name: 'sportiz_matches',
          ownerAccount: 'personal',
          accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });

        const newCalendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const foundCalendar = newCalendars.find(cal => cal.id === newCalendarID);
        if (foundCalendar) {
          defaultCalendar = foundCalendar;
        }
      }
    } catch (error) {
      console.error('Error creating calendar:', error);
      return null;
    }
  }

  return defaultCalendar || null;
};

const onAddToCalendar = async () => {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Calendar Access Required',
        'To set match reminders, please allow calendar access in your settings.',
        [{ text: 'Okay' }]
      );
      return;
    }

    const defaultCalendar = await getOrCreateCalendar();

    if (!defaultCalendar) {
      Alert.alert(
        'Calendar Setup Needed',
        'No calendar found on your device. Please add a Google account in Settings to use calendar features.',
        [{ text: 'Okay' }]
      );
      return;
    }

    const startDate = new Date(item.date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    const eventId = await Calendar.createEventAsync(defaultCalendar.id, {
      title: `${item.teamA} vs ${item.teamB}`,
      startDate,
      endDate,
      notes: `${item.sport} - ${item.league || 'International'}\n\nAdded via Sportiz App`,
      location: 'TBA',
      timeZone: 'GMT',
      alarms: [
        { relativeOffset: -60 },  // 1 hour before
        { relativeOffset: -30 },  // 30 minutes before
      ],
    });

    if (eventId) {
      Alert.alert(
        '✅ Event Added to Calendar',
        `You'll receive reminders 1 hour and 30 minutes before kickoff.`,
        [{ text: 'Got it!' }]
      );
    }
  } catch (error) {
    console.error('Calendar error:', error);
    Alert.alert(
      'Unable to Add Event',
      'Something went wrong while adding the match to your calendar. Please try again.',
      [{ text: 'Okay' }]
    );
  }
};

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <ImageBackground source={{ uri: item.image }} style={styles.hero} resizeMode="cover">
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.heroGradient}>
              <View style={styles.heroContent} />
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Floating Icons */}
        <View style={styles.floatingIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={onToggleFav}>
            <Feather
              name="heart"
              size={24}
              color={isFav ? '#ec4899' : '#374151'}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={onShare}>
            <Feather name="share-2" size={24} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={onAddToCalendar}>
            <Feather name="calendar" size={24} color="#10b981" />
          </TouchableOpacity>
        </View>

        {/* Main Content Card */}
        <BlurView intensity={isDark ? 40 : 20} style={styles.blurContainer}>
          <View style={[styles.contentCard, isDark ? styles.glassCardDark : styles.glassCardLight]}>
            {/* Competition Name */}
            <Text style={[styles.competitionLabel, { color: theme.primary }]}>
              {item.league || 'International Match'}
            </Text>

            {/* Teams Section */}
            <View style={styles.teamsSection}>
              <Text style={[styles.teamName, { color: theme.text }]}>{item.teamA}</Text>
              <View style={[styles.vsContainer, { backgroundColor: theme.primary + '25' }]}>
                <Text style={[styles.vsText, { color: theme.primary }]}>VS</Text>
              </View>
              <Text style={[styles.teamName, { color: theme.text }]}>{item.teamB}</Text>
            </View>

            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
              {(['overview', 'teams', 'players', 'stats'] as TabType[]).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[
                    styles.tab,
                    activeTab === tab && [styles.activeTab, { borderBottomColor: theme.primary }],
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: activeTab === tab ? theme.primary : theme.textSecondary },
                    ]}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tab Content */}
            <View style={styles.tabContent}>
              {activeTab === 'overview' && <OverviewTab item={item} theme={theme} isDark={isDark} />}
              {activeTab === 'teams' && <TeamsTab item={item} theme={theme} />}
              {activeTab === 'players' && <PlayersTab item={item} theme={theme} />}
              {activeTab === 'stats' && <StatsTab item={item} theme={theme} />}
            </View>
          </View>
        </BlurView>
      </ScrollView>
    </View>
  );
}

function OverviewTab({ item, theme, isDark }: any) {
  const [leagueInfo, setLeagueInfo] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadLeagueInfo = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/lookupleague.php?id=${item.leagueId}`);
        const data = await res.json();
        setLeagueInfo(data.leagues?.[0] || null);
      } catch (err) {
        console.log('Error loading league:', err);
      }
      setLoading(false);
    };
    if (item.leagueId) loadLeagueInfo();
  }, [item]);

  return (
    <View>
      {/* Competition Info */}
      {leagueInfo && (
        <View style={[styles.competitionCard, { backgroundColor: theme.primary + '15' }]}>
          <Text style={[styles.competitionTitle, { color: theme.primary }]}>About {item.league}</Text>
          <Text style={[styles.competitionDesc, { color: theme.text }]}>
            {leagueInfo.strDescriptionEN || leagueInfo.strDescription || 'Professional sports league'}
          </Text>
          <View style={styles.leagueInfoRow}>
            <View style={styles.leagueInfoItem}>
              <Text style={[styles.leagueLabel, { color: theme.textSecondary }]}>Country</Text>
              <Text style={[styles.leagueValue, { color: theme.text }]}>{leagueInfo.strCountry || 'N/A'}</Text>
            </View>
            <View style={styles.leagueInfoItem}>
              <Text style={[styles.leagueLabel, { color: theme.textSecondary }]}>Founded</Text>
              <Text style={[styles.leagueValue, { color: theme.text }]}>{leagueInfo.intFormedYear || 'N/A'}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Category */}
      <View style={styles.infoSection}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Category</Text>
        <Text style={[styles.value, { color: theme.text }]}>{item.sport}</Text>
      </View>

      {/* Venue */}
      <View style={styles.infoRow}>
        <Feather name="map-pin" size={18} color={theme.primary} />
        <View style={styles.infoContent}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Venue</Text>
          <Text style={[styles.value, { color: theme.text }]}>TBA</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Date & Time Row */}
      <View style={styles.dateTimeRow}>
        <View style={styles.dateSection}>
          <View style={[styles.iconCircle, { backgroundColor: theme.primary + '25' }]}>
            <Feather name="calendar" size={20} color={theme.primary} />
          </View>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Date</Text>
          <Text style={[styles.value, { color: theme.text }]}>
            {new Date(item.date).toLocaleDateString('en-GB', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })}
          </Text>
        </View>

        <View style={styles.timeSection}>
          <View style={[styles.iconCircle, { backgroundColor: theme.accent + '25' }]}>
            <Feather name="clock" size={20} color={theme.accent} />
          </View>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Time</Text>
          <Text style={[styles.value, { color: theme.text }]}>
            {new Date(item.date).toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        <View style={styles.statusSection}>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'ongoing' ? '#10b98125' : theme.primary + '25' }]}>
            <View 
              style={[
                styles.statusDot, 
                { backgroundColor: item.status === 'ongoing' ? '#10b981' : theme.primary }
              ]} 
            />
          </View>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Status</Text>
          <Text style={[styles.statusValue, { color: item.status === 'ongoing' ? '#10b981' : theme.primary }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
    </View>
  );
}

function TeamsTab({ item, theme }: any) {
  const [teams, setTeams] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadTeams = async () => {
      setLoading(true);
      // Fetch team details - using item IDs if available, otherwise create mock data
      const teamA = await fetchTeamDetails(item.teamAId);
      const teamB = await fetchTeamDetails(item.teamBId);

      setTeams([
        {
          name: item.teamA,
          wins: teamA?.intWin || 12,
          losses: teamA?.intLoss || 5,
          draws: teamA?.intDraws || 3,
        },
        {
          name: item.teamB,
          wins: teamB?.intWin || 10,
          losses: teamB?.intLoss || 6,
          draws: teamB?.intDraws || 4,
        },
      ]);
      setLoading(false);
    };
    loadTeams();
  }, [item]);

  if (loading) {
    return <Text style={{ color: theme.text, textAlign: 'center', padding: 20 }}>Loading teams...</Text>;
  }

  return (
    <View>
      {teams.map((team, idx) => (
        <View key={idx}>
          <View style={[styles.teamCard, { backgroundColor: theme.primary + '15' }]}>
            <Text style={[styles.teamCardTitle, { color: theme.text }]}>{team.name}</Text>
            <View style={styles.teamStatsRow}>
              <View style={styles.teamStat}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Wins</Text>
                <Text style={[styles.statValue, { color: theme.primary }]}>{team.wins}</Text>
              </View>
              <View style={styles.teamStat}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Losses</Text>
                <Text style={[styles.statValue, { color: '#ef4444' }]}>{team.losses}</Text>
              </View>
              <View style={styles.teamStat}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Draws</Text>
                <Text style={[styles.statValue, { color: '#f59e0b' }]}>{team.draws}</Text>
              </View>
            </View>
          </View>
          {idx === 0 && <View style={{ height: 12 }} />}
        </View>
      ))}
    </View>
  );
}

function PlayersTab({ item, theme }: any) {
  const [players, setPlayers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadPlayers = async () => {
      setLoading(true);
      let allPlayers: any[] = [];

      if (item.teamAId) {
        const teamAPlayers = await fetchTeamPlayers(item.teamAId);
        allPlayers.push(...(teamAPlayers.slice(0, 5).map((p: any) => ({
          name: p.strPlayer,
          team: item.teamA,
          position: p.strPosition || 'Player',
          number: parseInt(p.strNumber) || Math.floor(Math.random() * 23) + 1,
          image: p.strCutout || null,
          age: p.intAge || null,
        })) || []));
      }

      if (item.teamBId) {
        const teamBPlayers = await fetchTeamPlayers(item.teamBId);
        allPlayers.push(...(teamBPlayers.slice(0, 5).map((p: any) => ({
          name: p.strPlayer,
          team: item.teamB,
          position: p.strPosition || 'Player',
          number: parseInt(p.strNumber) || Math.floor(Math.random() * 23) + 1,
          image: p.strCutout || null,
          age: p.intAge || null,
        })) || []));
      }

      if (allPlayers.length === 0) {
        allPlayers = [
          { name: 'Player 1', team: item.teamA, position: 'Forward', number: 7, image: null, age: 28 },
          { name: 'Player 2', team: item.teamA, position: 'Midfielder', number: 8, image: null, age: 25 },
          { name: 'Player 3', team: item.teamB, position: 'Defender', number: 4, image: null, age: 30 },
          { name: 'Player 4', team: item.teamB, position: 'Goalkeeper', number: 1, image: null, age: 32 },
        ];
      }

      setPlayers(allPlayers);
      setLoading(false);
    };
    loadPlayers();
  }, [item]);

  if (loading) {
    return <Text style={{ color: theme.text, textAlign: 'center', padding: 20 }}>Loading players...</Text>;
  }

  return (
    <View>
      {players.map((player, idx) => (
        <View
          key={idx}
          style={[
            styles.playerCard,
            { 
              backgroundColor: player.team === item.teamA ? theme.primary + '15' : theme.accent + '15',
              borderLeftColor: player.team === item.teamA ? theme.primary : theme.accent,
              borderLeftWidth: 4,
            }
          ]}
        >
          {player.image ? (
            <ImageBackground
              source={{ uri: player.image }}
              style={styles.playerImage}
              resizeMode="cover"
            >
              <Text style={[styles.playerNumber, { backgroundColor: '#000000cc' }]}>{player.number}</Text>
            </ImageBackground>
          ) : (
            <View style={[styles.playerNumber, { backgroundColor: theme.primary }]}>
              <Text style={[styles.numberText, { color: '#fff' }]}>{player.number}</Text>
            </View>
          )}
          <View style={styles.playerInfo}>
            <Text style={[styles.playerName, { color: theme.text }]}>{player.name}</Text>
            <Text style={[styles.playerPosition, { color: theme.textSecondary }]}>{player.position}</Text>
            {player.age && <Text style={[styles.playerAge, { color: theme.textSecondary }]}>Age: {player.age}</Text>}
          </View>
          <Text style={[styles.playerTeam, { color: theme.textSecondary }]}>{player.team}</Text>
        </View>
      ))}
    </View>
  );
}

function StatsTab({ item, theme }: any) {
  const [stats, setStats] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      const eventStats = await fetchEventStats(item.id);

      if (eventStats && eventStats.length > 0) {
        const statsMap: Record<string, any> = {};
        
        eventStats.forEach((stat: any) => {
          const type = stat.strStatistic;
          if (!statsMap[type]) {
            statsMap[type] = { label: type, teamA: 0, teamB: 0, description: getStatDescription(type) };
          }
          
          if (stat.strTeam === item.teamA) {
            statsMap[type].teamA = parseInt(stat.intStat) || 0;
          } else {
            statsMap[type].teamB = parseInt(stat.intStat) || 0;
          }
        });

        setStats(Object.values(statsMap).slice(0, 6));
      } else {
        setStats([
          { label: 'Possession %', teamA: 55, teamB: 45, description: 'Percentage of time ball is with the team' },
          { label: 'Shots', teamA: 12, teamB: 8, description: 'Total shots attempted' },
          { label: 'Shots on Target', teamA: 6, teamB: 4, description: 'Shots that hit the target' },
          { label: 'Pass Accuracy %', teamA: 68, teamB: 72, description: 'Percentage of accurate passes' },
          { label: 'Fouls', teamA: 14, teamB: 11, description: 'Total fouls committed' },
          { label: 'Yellow Cards', teamA: 2, teamB: 1, description: 'Cautions given' },
        ]);
      }
      setLoading(false);
    };
    loadStats();
  }, [item]);

  if (loading) {
    return <Text style={{ color: theme.text, textAlign: 'center', padding: 20 }}>Loading stats...</Text>;
  }

  return (
    <View>
      {stats.map((stat, idx) => (
        <View key={idx} style={styles.statRowContainer}>
          <View style={styles.statRowHeader}>
            <Text style={[styles.statRowLabel, { color: theme.text }]}>{stat.label}</Text>
            <Text style={[styles.statRowValues, { color: theme.textSecondary }]}>
              {stat.teamA} : {stat.teamB}
            </Text>
          </View>
          {stat.description && (
            <Text style={[styles.statDescription, { color: theme.textSecondary }]}>{stat.description}</Text>
          )}
          <View style={styles.statBars}>
            <View 
              style={[
                { 
                  flex: stat.teamA, 
                  backgroundColor: theme.primary, 
                  borderTopLeftRadius: 4, 
                  borderBottomLeftRadius: 4 
                }
              ]} 
            />
            <View 
              style={[
                { 
                  flex: stat.teamB, 
                  backgroundColor: theme.accent, 
                  borderTopRightRadius: 4, 
                  borderBottomRightRadius: 4 
                }
              ]} 
            />
          </View>
        </View>
      ))}
    </View>
  );
}

function getStatDescription(statType: string): string {
  const descriptions: Record<string, string> = {
    'Possession %': 'Percentage of time ball is with the team',
    'Shots': 'Total shots attempted on goal',
    'Shots on Target': 'Shots that were aimed at the goal',
    'Pass Accuracy %': 'Percentage of successful passes',
    'Fouls': 'Total fouls committed',
    'Yellow Cards': 'Cautions given to players',
    'Red Cards': 'Players sent off',
    'Corner Kicks': 'Defensive corner opportunities',
    'Passes': 'Total number of passes made',
    'Tackles': 'Successful defensive tackles',
  };
  return descriptions[statType] || 'Match statistic';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroContainer: { height: 260 },
  hero: { flex: 1 },
  heroGradient: { flex: 1, justifyContent: 'flex-end' },
  heroContent: { padding: 24 },

  floatingIcons: {
    position: 'absolute',
    top: 270,
    right: 10,
    flexDirection: 'column',
    gap: 12,
    zIndex: 10,
  },
  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },

  blurContainer: {
    marginHorizontal: 16,
    marginTop: -60,
    marginBottom: 40,
    borderRadius: 24,
    overflow: 'hidden',
  },

  contentCard: {
    padding: 24,
  },

  glassCardLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },

  glassCardDark: {
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.2)',
  },

  competitionLabel: { 
    fontSize: 14, 
    fontWeight: '700',
    alignSelf: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },

  teamsSection: {
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  teamName: { 
    fontSize: 22, 
    fontWeight: '800', 
    textAlign: 'center',
  },
  vsContainer: { 
    paddingHorizontal: 24, 
    paddingVertical: 8, 
    borderRadius: 20,
  },
  vsText: { 
    fontSize: 14, 
    fontWeight: '800', 
    letterSpacing: 2,
  },

  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },

  tabContent: {
    marginTop: 12,
  },

  infoSection: {
    marginBottom: 16,
  },
  label: { 
    fontSize: 11, 
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  value: { 
    fontSize: 16, 
    fontWeight: '700',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  infoContent: { flex: 1 },

  divider: { height: 1, marginVertical: 16 },

  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  dateSection: { flex: 1, alignItems: 'center' },
  timeSection: { flex: 1, alignItems: 'center' },
  statusSection: { flex: 1, alignItems: 'center' },

  iconCircle: { 
    width: 45, 
    height: 45, 
    borderRadius: 24, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusValue: {
    fontSize: 14,
    fontWeight: '700',
  },

  teamCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  teamCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  teamStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  teamStat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },

  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  playerNumber: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  playerImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 16,
    fontWeight: '800',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  playerPosition: {
    fontSize: 12,
    fontWeight: '500',
  },
  playerAge: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  playerTeam: {
    fontSize: 12,
    fontWeight: '600',
  },

  competitionCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  competitionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  competitionDesc: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  leagueInfoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  leagueInfoItem: {
    flex: 1,
  },
  leagueLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  leagueValue: {
    fontSize: 14,
    fontWeight: '700',
  },

  statRowContainer: {
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  statRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statRowLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  statRowValues: {
    fontSize: 12,
    fontWeight: '600',
  },
  statDescription: {
    fontSize: 11,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  statBars: {
    flex: 1,
    height: 8,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  statsTypeLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});