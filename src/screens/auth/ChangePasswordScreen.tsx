import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {changePasswordSchema, ChangePasswordFormData} from '@utils/validation.utils';
import {updatePassword} from '@services/firebase/auth.service';
import {updateDocument} from '@services/firestore/base.repository';
import {parseError} from '@utils/error.utils';
import {useAuth} from '@hooks/auth/useAuth';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {TYPOGRAPHY} from '@constants/typography';

export default function ChangePasswordScreen() {
  const [loading, setLoading] = useState(false);
  const {user} = useAuth();

  const {control, handleSubmit, formState: {errors}} = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setLoading(true);
    try {
      await updatePassword(data.newPassword);
      if (user?.uid) {
        await updateDocument('users', user.uid, {requiresPasswordChange: false});
      }
      // RootNavigator will re-evaluate and navigate to App
    } catch (err) {
      Alert.alert('Error', parseError(err).userMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set New Password</Text>
      <Text style={styles.body}>Please set a new password before continuing.</Text>

      <Controller
        control={control}
        name="newPassword"
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.fieldWrapper}>
            <TextInput style={[styles.input, errors.newPassword && styles.inputError]} placeholder="New password" placeholderTextColor={COLORS.outline} onBlur={onBlur} onChangeText={onChange} value={value} secureTextEntry />
            {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword.message}</Text>}
          </View>
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.fieldWrapper}>
            <TextInput style={[styles.input, errors.confirmPassword && styles.inputError]} placeholder="Confirm password" placeholderTextColor={COLORS.outline} onBlur={onBlur} onChangeText={onChange} value={value} secureTextEntry />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
          </View>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={loading}>
        {loading ? <ActivityIndicator color={COLORS.onPrimary} /> : <Text style={styles.buttonText}>Save Password</Text>}
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
});
