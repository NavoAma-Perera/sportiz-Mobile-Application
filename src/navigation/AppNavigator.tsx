import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../types';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

export default function AppNavigator() {
  const token = useSelector((state: RootState) => state.auth.token);
  return token ? <MainTabNavigator /> : <AuthNavigator />;
}