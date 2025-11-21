// src/screens/Auth/RegisterScreen.tsx
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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../store';
import { Colors } from '@/src/constants/colors';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Full name is required'),
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function RegisterScreen({ navigation }: { navigation: any }) {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);
  const isDark = useSelector((state: RootState) => state.favourites.isDark);
  const theme = Colors(isDark);

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    dispatch(clearError());
    try {
      await dispatch(registerUser({
        email: values.email,
        password: values.password,
        username: values.username,
        name: values.name,
      })).unwrap();

      Alert.alert(
        'Registration Successful! 🎉',
        'Welcome to Sportiz! You are now logged in.',
        [{ text: 'Get Started' }]
      );
    } catch (err) {
      // Error shown below
    } finally {
      setSubmitting(false);
    }
  };

  // Dark mode = gradient + dark glass, Light mode = clean white
  if (isDark) {
    return (
      <LinearGradient colors={['#6366f1', '#8b5cf6', '#ec4899']} style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <RegisterContent isDark={isDark} theme={theme} error={error} status={status} showPassword={showPassword} setShowPassword={setShowPassword} showConfirmPassword={showConfirmPassword} setShowConfirmPassword={setShowConfirmPassword} handleSubmit={handleSubmit} navigation={navigation} />
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <RegisterContent isDark={isDark} theme={theme} error={error} status={status} showPassword={showPassword} setShowPassword={setShowPassword} showConfirmPassword={showConfirmPassword} setShowConfirmPassword={setShowConfirmPassword} handleSubmit={handleSubmit} navigation={navigation} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function RegisterContent({ isDark, theme, error, status, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword, handleSubmit, navigation }: any) {
  return (
    <View style={styles.container}>
      <BlurView intensity={isDark ? 80 : 60} tint={isDark ? 'dark' : 'light'} style={styles.card}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={28} color={theme.text} />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Feather name="activity" size={64} color={theme.primaryLight} />
          <Text style={[styles.logoText, { color: theme.text }]}>Sportiz</Text>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Join the sports community today</Text>

        <Formik
          initialValues={{ name: '', username: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <View style={styles.form}>
              {/* Full Name */}
              <View style={[styles.inputContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#f8fafc', borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e2e8f0' }]}>
                <Feather name="user" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                  placeholder="Full Name"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { color: theme.text }]}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
              </View>
              {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

              {/* Username */}
              <View style={[styles.inputContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#f8fafc', borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e2e8f0' }]}>
                <Feather name="at-sign" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                  placeholder="Username"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { color: theme.text }]}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  value={values.username}
                  autoCapitalize="none"
                />
              </View>
              {touched.username && errors.username && <Text style={styles.error}>{errors.username}</Text>}

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

              {/* Confirm Password */}
              <View style={[styles.inputContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#f8fafc', borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e2e8f0' }]}>
                <Feather name="lock" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                  placeholder="Confirm Password"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { color: theme.text }]}
                  secureTextEntry={!showConfirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Feather name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
              {touched.confirmPassword && errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}

              {/* Server Error */}
              {error && <Text style={styles.serverError}>{error}</Text>}

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primaryLight }, (isSubmitting || status === 'loading') && styles.buttonDisabled]}
                onPress={() => handleSubmit()}
                disabled={isSubmitting || status === 'loading'}
              >
                {status === 'loading' ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        {/* Login Link */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.linkText, { color: theme.accent }]}>Sign In</Text>
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
  backBtn: { position: 'absolute', top: 16, left: 16, zIndex: 10 },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
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
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontSize: 15 },
  linkText: { fontWeight: '700', fontSize: 15 },
});