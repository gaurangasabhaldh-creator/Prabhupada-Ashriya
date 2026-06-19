import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ImageBackground,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {signupSchema, SignupFormData} from '@utils/validation.utils';
import {signUp} from '@services/firebase/auth.service';
import {parseError} from '@utils/error.utils';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {TYPOGRAPHY} from '@constants/typography';
import {AuthScreenProps} from '@mytypes/navigation.types';
import {AUTH_ROUTES} from '@constants/routes';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const backgroundImage = require('@/assets/images/lord-chaitanya.jpg');

type Props = AuthScreenProps<'Signup'>;

export default function SignupScreen({navigation}: Props) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {control, handleSubmit, formState: {errors}} = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      await signUp(data.email, data.password);
    } catch (err) {
      const {userMessage} = parseError(err);
      Alert.alert('Signup Failed', userMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.85)']}
        style={styles.gradient}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.topSection}>
              <Text style={styles.brand}>Prabhupad Ashraya</Text>
              <Text style={styles.subtitle}>Devotee Management</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.welcomeText}>Create Account</Text>
              <Text style={styles.signInText}>Sign up to get started</Text>

              <View style={styles.form}>
                <Controller
                  control={control}
                  name="email"
                  render={({field: {onChange, onBlur, value}}) => (
                    <View style={styles.fieldWrapper}>
                      <View style={styles.inputContainer}>
                        <Icon name="email-outline" size={20} color="#DAA520" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Email address"
                          placeholderTextColor="rgba(255,255,255,0.5)"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                      </View>
                      {errors.email && (
                        <Text style={styles.errorText}>{errors.email.message}</Text>
                      )}
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({field: {onChange, onBlur, value}}) => (
                    <View style={styles.fieldWrapper}>
                      <View style={styles.inputContainer}>
                        <Icon name="lock-outline" size={20} color="#DAA520" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Password"
                          placeholderTextColor="rgba(255,255,255,0.5)"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                          style={styles.eyeIcon}>
                          <Icon
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={22}
                            color="rgba(255,255,255,0.7)"
                          />
                        </TouchableOpacity>
                      </View>
                      {errors.password && (
                        <Text style={styles.errorText}>{errors.password.message}</Text>
                      )}
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({field: {onChange, onBlur, value}}) => (
                    <View style={styles.fieldWrapper}>
                      <View style={styles.inputContainer}>
                        <Icon name="lock-check-outline" size={20} color="#DAA520" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Confirm Password"
                          placeholderTextColor="rgba(255,255,255,0.5)"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          secureTextEntry={!showConfirmPassword}
                        />
                        <TouchableOpacity
                          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={styles.eyeIcon}>
                          <Icon
                            name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={22}
                            color="rgba(255,255,255,0.7)"
                          />
                        </TouchableOpacity>
                      </View>
                      {errors.confirmPassword && (
                        <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                      )}
                    </View>
                  )}
                />

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSubmit(onSubmit)}
                  disabled={loading}
                  activeOpacity={0.8}>
                  {loading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text style={styles.buttonText}>SIGN UP</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.loginRow}>
                  <Text style={styles.loginLabel}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate(AUTH_ROUTES.LOGIN)}>
                    <Text style={styles.loginLink}>Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    minHeight: 200,
  },
  brand: {
    ...TYPOGRAPHY['display-lg'],
    color: '#FFD700',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: {width: 1, height: 2},
    textShadowRadius: 8,
  },
  subtitle: {
    ...TYPOGRAPHY['body-lg'],
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  formSection: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  welcomeText: {
    ...TYPOGRAPHY['headline-md'],
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
  },
  signInText: {
    ...TYPOGRAPHY['body-md'],
    color: 'rgba(255,255,255,0.7)',
    marginBottom: SPACING.lg,
  },
  form: {
    gap: SPACING.md,
  },
  fieldWrapper: {
    gap: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(218,165,32,0.4)',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    ...TYPOGRAPHY['body-lg'],
    color: '#FFFFFF',
    flex: 1,
    paddingVertical: SPACING.sm + 4,
  },
  eyeIcon: {
    padding: SPACING.xs,
  },
  errorText: {
    ...TYPOGRAPHY['body-sm'],
    color: '#FF6B6B',
    marginLeft: SPACING.xs,
  },
  button: {
    backgroundColor: '#FFD700',
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
    shadowColor: '#FFD700',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    ...TYPOGRAPHY['label-lg'],
    color: '#1a1a1a',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 14,
    fontWeight: '700',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  loginLabel: {
    ...TYPOGRAPHY['body-md'],
    color: 'rgba(255,255,255,0.7)',
  },
  loginLink: {
    ...TYPOGRAPHY['body-md'],
    color: '#FFD700',
    fontWeight: '600',
  },
});
