import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Text} from '@components/common/Typography/Text';
import {Button} from '@components/common/Button/Button';
import {IconButton} from '@components/common/Button/IconButton';
import {BasicInfoStep} from '@components/devotees/DevoteeForm/BasicInfoStep';
import {DevotionalInfoStep} from '@components/devotees/DevoteeForm/DevotionalInfoStep';
import {AdditionalInfoStep} from '@components/devotees/DevoteeForm/AdditionalInfoStep';
import {useCreateDevotee} from '@hooks/devotees/useDevoteeMutation';
import {useAuth} from '@hooks/auth/useAuth';
import {
  devoteeBasicInfoSchema,
  DevoteeBasicInfoData,
  devoteeDevotionalInfoSchema,
  DevoteeDevotionalInfoData,
  devoteeAdditionalInfoSchema,
  DevoteeAdditionalInfoData,
} from '@utils/validation.utils';
import {toTimestamp, nowTimestamp} from '@utils/date.utils';
import {formatToE164} from '@utils/phone.utils';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';

const STEPS = ['Basic Info', 'Devotional', 'Additional'] as const;

export default function AddDevoteeScreen({navigation}: any) {
  const [step, setStep] = useState(0);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const {user} = useAuth();
  const createMutation = useCreateDevotee();

  const basicForm = useForm<DevoteeBasicInfoData>({
    resolver: zodResolver(devoteeBasicInfoSchema),
    defaultValues: {gender: null, dateOfBirth: null},
  });

  const devotionalForm = useForm<DevoteeDevotionalInfoData>({
    resolver: zodResolver(devoteeDevotionalInfoSchema),
    defaultValues: {categories: [], joiningDate: new Date()},
  });

  const additionalForm = useForm<DevoteeAdditionalInfoData>({
    resolver: zodResolver(devoteeAdditionalInfoSchema),
    defaultValues: {city: null, occupation: null, maritalStatus: null},
  });

  const handleNext = async () => {
    let valid = false;
    if (step === 0) valid = await basicForm.trigger();
    else if (step === 1) valid = await devotionalForm.trigger();
    else if (step === 2) await handleSubmit();

    if (valid && step < 2) setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    const basic = basicForm.getValues();
    const devotional = devotionalForm.getValues();
    const additional = additionalForm.getValues();

    await createMutation.mutateAsync({
      payload: {
        fullName: basic.fullName,
        mobileNumber: formatToE164(basic.mobileNumber),
        email: basic.email || null,
        gender: basic.gender,
        dateOfBirth: basic.dateOfBirth ? toTimestamp(basic.dateOfBirth) : null,
        photoURL: null,
        categories: devotional.categories,
        primaryCategory: devotional.primaryCategory ?? devotional.categories[0],
        teamId: devotional.teamId,
        organizationId: user!.organizationId,
        mentorId: null,
        mentorName: null,
        joiningDate: toTimestamp(devotional.joiningDate),
        city: additional.city,
        occupation: additional.occupation,
        maritalStatus: additional.maritalStatus,
        addedBy: user!.uid,
        lastEditedBy: null,
      },
      photoUri: photoUri ?? undefined,
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton name="close" onPress={() => navigation.goBack()} accessibilityLabel="Cancel" />
        <Text variant="title-lg" color="primary">Add Devotee</Text>
        <View style={{width: 44}} />
      </View>

      {/* Step indicator */}
      <View style={styles.stepIndicator}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <View style={styles.stepItem}>
              <View style={[styles.stepDot, i <= step && styles.stepDotActive, i < step && styles.stepDotDone]}>
                <Text variant="label-md" style={{color: i <= step ? COLORS.onPrimary : COLORS.outline}}>
                  {i < step ? '✓' : String(i + 1)}
                </Text>
              </View>
              <Text variant="label-md" style={{color: i === step ? COLORS.primary : COLORS.outline, marginTop: 4}}>
                {s}
              </Text>
            </View>
            {i < STEPS.length - 1 && (
              <View style={[styles.stepLine, i < step && styles.stepLineDone]} />
            )}
          </React.Fragment>
        ))}
      </View>

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {step === 0 && (
            <BasicInfoStep form={basicForm} photoUri={photoUri} onPhotoChange={setPhotoUri} />
          )}
          {step === 1 && <DevotionalInfoStep form={devotionalForm} />}
          {step === 2 && <AdditionalInfoStep form={additionalForm} />}

        </ScrollView>

        {/* Footer buttons */}
        <View style={styles.footer}>
          {step > 0 && (
            <Button
              label="Back"
              onPress={() => setStep(s => s - 1)}
              variant="outline"
              size="lg"
              style={{flex: 1}}
            />
          )}
          <Button
            label={step === 2 ? 'Save Devotee' : 'Next'}
            onPress={handleNext}
            variant="primary"
            size="lg"
            loading={createMutation.isPending}
            rightIcon={step < 2 ? 'arrow_forward' : undefined}
            leftIcon={step === 2 ? 'check' : undefined}
            style={{flex: step > 0 ? 1 : undefined, alignSelf: step === 0 ? 'stretch' : undefined}}
            fullWidth={step === 0}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  stepItem: {alignItems: 'center'},
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceContainerHigh,
    borderWidth: 1.5,
    borderColor: COLORS.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {backgroundColor: COLORS.primary, borderColor: COLORS.primary},
  stepDotDone: {backgroundColor: COLORS.success, borderColor: COLORS.success},
  stepLine: {flex: 1, height: 2, backgroundColor: COLORS.outlineVariant, marginBottom: 18},
  stepLineDone: {backgroundColor: COLORS.primary},
  content: {padding: SPACING.marginMobile, paddingBottom: SPACING.xl},
  footer: {
    flexDirection: 'row',
    gap: SPACING.md,
    padding: SPACING.marginMobile,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.outlineVariant,
    backgroundColor: COLORS.background,
  },
});
