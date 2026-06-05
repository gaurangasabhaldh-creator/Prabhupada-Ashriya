import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {forgotPasswordSchema, ForgotPasswordFormData} from '@utils/validation.utils';
import {sendPasswordReset} from '@services/firebase/auth.service';
import {parseError} from '@utils/error.utils';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {TYPOGRAPHY} from '@constants/typography';
import {AuthScreenProps} from '@mytypes/navigation.types';

type Props = AuthScreenProps<'ForgotPassword'>;

export default function ForgotPasswordScreen({navigation}: Props) {
  const [loading, setLoading] = useState(false);

  const {control, handleSubmit, formState: {errors}} = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      await sendPasswordReset(data.email);
      Alert.alert('Email Sent', 'Check your inbox for a password reset link.', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (err) {
      Alert.alert('Error', parseError(err).userMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.body}>
        Enter your email address and we will send you a link to reset your password.
      </Text>

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
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
          </View>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={loading}>
        {loading ? <ActivityIndicator color={COLORS.onPrimary} /> : (
          <Text style={styles.buttonText}>Send Reset Link</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background, padding: SPACING.marginMobile, justifyContent: 'center'},
  title: {...TYPOGRAPHY['headline-md'], color: COLORS.secondary, marginBottom: SPACING.sm},
  body: {...TYPOGRAPHY['body-md'], color: COLORS.onSurfaceVariant, marginBottom: SPACING.xl},
  fieldWrapper: {marginBottom: SPACING.md},
  input: {...TYPOGRAPHY['body-lg'], color: COLORS.onSurface, borderWidth: 1, borderColor: COLORS.outline, borderRadius: BORDER_RADIUS.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm + 4, backgroundColor: COLORS.surfaceContainerLowest},
  inputError: {borderColor: COLORS.error},
  errorText: {...TYPOGRAPHY['body-sm'], color: COLORS.error},
  button: {backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.full, paddingVertical: SPACING.md, alignItems: 'center'},
  buttonText: {...TYPOGRAPHY['label-lg'], color: COLORS.onPrimary, textTransform: 'uppercase', letterSpacing: 1},
  back: {alignItems: 'center', marginTop: SPACING.md},
  backText: {...TYPOGRAPHY['body-md'], color: COLORS.primary},
});
