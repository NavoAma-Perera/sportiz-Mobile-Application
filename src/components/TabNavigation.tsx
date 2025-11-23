import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export type TabType = 'overview' | 'teams' | 'players' | 'stats';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  primaryColor: string;
  textSecondaryColor: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  primaryColor,
  textSecondaryColor,
}) => {
  const tabs: TabType[] = ['overview', 'teams', 'players', 'stats'];

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => onTabChange(tab)}
          style={[
            styles.tab,
            activeTab === tab && [styles.activeTab, { borderBottomColor: primaryColor }],
          ]}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === tab ? primaryColor : textSecondaryColor },
            ]}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
});