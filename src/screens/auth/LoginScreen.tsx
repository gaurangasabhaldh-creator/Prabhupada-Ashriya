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
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {loginSchema, LoginFormData} from '@utils/validation.utils';
import {signIn} from '@services/firebase/auth.service';
import {parseError} from '@utils/error.utils';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {TYPOGRAPHY} from '@constants/typography';
import {AuthScreenProps} from '@mytypes/navigation.types';
import {AUTH_ROUTES} from '@constants/routes';

type Props = AuthScreenProps<'Login'>;

export default function LoginScreen({navigation}: Props) {
  const [loading, setLoading] = useState(false);

  const {control, handleSubmit, formState: {errors}} = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await signIn(data.email, data.password);
      // RootNavigator's onAuthStateChanged handles the redirect
    } catch (err) {
      const {userMessage} = parseError(err);
      Alert.alert('Login Failed', userMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.inner}>
        <Text style={styles.brand}>Prabhupad Ashraya</Text>
        <Text style={styles.subtitle}>Devotee Management</Text>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({field: {onChange, onBlur, value}}) => (
              <View style={styles.fieldWrapper}>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="Email address"
                  placeholderTextColor={COLORS.outline}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
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
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder="Password"
                  placeholderTextColor={COLORS.outline}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                />
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password.message}</Text>
                )}
              </View>
            )}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color={COLORS.onPrimary} />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => navigation.navigate(AUTH_ROUTES.FORGOT_PASSWORD)}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.marginMobile,
  },
  brand: {
    ...TYPOGRAPHY['headline-lg'],
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY['body-md'],
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  form: {gap: SPACING.md},
  fieldWrapper: {gap: SPACING.xs},
  input: {
    ...TYPOGRAPHY['body-lg'],
    color: COLORS.onSurface,
    borderWidth: 1,
    borderColor: COLORS.outline,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    backgroundColor: COLORS.surfaceContainerLowest,
  },
  inputError: {borderColor: COLORS.error},
  errorText: {
    ...TYPOGRAPHY['body-sm'],
    color: COLORS.error,
    marginLeft: SPACING.xs,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  buttonText: {
    ...TYPOGRAPHY['label-lg'],
    color: COLORS.onPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  forgotButton: {alignItems: 'center', paddingVertical: SPACING.sm},
  forgotText: {
    ...TYPOGRAPHY['body-md'],
    color: COLORS.primary,
  },
});
