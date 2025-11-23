// src/screens/LoginScreen.tsx
import React from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../store';
import { Colors } from '@/src/constants/colors';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too short').required('Required'),
});

export default function LoginScreen({ navigation }: { navigation: any }) {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);
  const isDark = useSelector((state: RootState) => state.favourites.isDark);
  const theme = Colors(isDark);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    dispatch(clearError());
    try {
      await dispatch(loginUser(values)).unwrap();
    } catch (err) {} finally {
      setSubmitting(false);
    }
  };

  if (isDark) {
    return (
      <LinearGradient colors={['#6366f1', '#8b5cf6', '#ec4899']} style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <AuthCard isDark={isDark} theme={theme} error={error} status={status} showPassword={showPassword} setShowPassword={setShowPassword} handleSubmit={handleSubmit} navigation={navigation} />
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <AuthCard isDark={isDark} theme={theme} error={error} status={status} showPassword={showPassword} setShowPassword={setShowPassword} handleSubmit={handleSubmit} navigation={navigation} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function AuthCard({ isDark, theme, error, status, showPassword, setShowPassword, handleSubmit, navigation }: any) {
  return (
    <View style={styles.container}>
      <BlurView intensity={isDark ? 80 : 60} tint={isDark ? 'dark' : 'light'} style={styles.card}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <LinearGradient colors={['#8b5cf6', '#ec4899']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.iconGradientBg}>
            <Feather name="activity" size={64} color="#fff" />
          </LinearGradient>
          <View style={styles.brandContainer}>
            <Text style={[styles.logoText, { color: theme.text }]}>Sport</Text>
            <Text style={[styles.logoText, { color: '#8b5cf6' }]}>i</Text>
            <Text style={[styles.logoText, { color: '#ec4899' }]}>z</Text>
          </View>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Sign in to track your favorite matches
        </Text>

        <Formik initialValues={{ email: '', password: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <View style={styles.form}>
              {/* Email */}
              <View style={[styles.inputContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#f8fafc', borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e2e8f0' }]}>
                <Feather name="mail" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { color: theme.text }]}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

              {/* Password */}
              <View style={[styles.inputContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#f8fafc', borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e2e8f0' }]}>
                <Feather name="lock" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { color: theme.text }]}
                  secureTextEntry={!showPassword}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

              {error && <Text style={styles.serverError}>{error}</Text>}

              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primaryLight }]}
                onPress={() => handleSubmit()}
                disabled={isSubmitting || status === 'loading'}
              >
                {status === 'loading' ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.linkText, { color: theme.accent }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  card: {
    borderRadius: 28,
    padding: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 24,
  },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  iconGradientBg: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  brandContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  logoText: { fontSize: 36, fontWeight: '800', marginTop: 16 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 32 },
  form: { gap: 16 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16 },
  error: { color: '#ef4444', fontSize: 13, marginTop: -8, marginLeft: 4 },
  serverError: { color: '#ef4444', textAlign: 'center', fontWeight: '600', marginTop: 8 },
  button: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontSize: 15 },
  linkText: { fontWeight: '700', fontSize: 15 },
});