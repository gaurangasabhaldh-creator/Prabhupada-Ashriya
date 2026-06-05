import React, {useEffect, useState} from 'react';
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
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {BasicInfoStep} from '@components/devotees/DevoteeForm/BasicInfoStep';
import {DevotionalInfoStep} from '@components/devotees/DevoteeForm/DevotionalInfoStep';
import {AdditionalInfoStep} from '@components/devotees/DevoteeForm/AdditionalInfoStep';
import {useDevotee} from '@hooks/devotees/useDevotee';
import {useUpdateDevotee} from '@hooks/devotees/useDevoteeMutation';
import {
  devoteeBasicInfoSchema, DevoteeBasicInfoData,
  devoteeDevotionalInfoSchema, DevoteeDevotionalInfoData,
  devoteeAdditionalInfoSchema, DevoteeAdditionalInfoData,
} from '@utils/validation.utils';
import {toTimestamp} from '@utils/date.utils';
import {formatToE164} from '@utils/phone.utils';
import {COLORS} from '@constants/colors';
import {SPACING} from '@constants/spacing';

const STEPS = ['Basic Info', 'Devotional', 'Additional'] as const;

export default function EditDevoteeScreen({route, navigation}: any) {
  const {devoteeId} = route.params;
  const [step, setStep] = useState(0);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const {data: devotee, isLoading} = useDevotee(devoteeId);
  const updateMutation = useUpdateDevotee();

  const basicForm = useForm<DevoteeBasicInfoData>({resolver: zodResolver(devoteeBasicInfoSchema)});
  const devotionalForm = useForm<DevoteeDevotionalInfoData>({resolver: zodResolver(devoteeDevotionalInfoSchema)});
  const additionalForm = useForm<DevoteeAdditionalInfoData>({resolver: zodResolver(devoteeAdditionalInfoSchema)});

  // Pre-fill forms once devotee data arrives
  useEffect(() => {
    if (!devotee) return;
    basicForm.reset({
      fullName: devotee.fullName,
      mobileNumber: devotee.mobileNumber,
      email: devotee.email ?? '',
      gender: devotee.gender,
      dateOfBirth: devotee.dateOfBirth ? devotee.dateOfBirth.toDate() : null,
    });
    devotionalForm.reset({
      primaryCategory: devotee.primaryCategory,
      categories: devotee.categories,
      teamId: devotee.teamId,
      mentorId: devotee.mentorId ?? undefined,
      joiningDate: devotee.joiningDate.toDate(),
    });
    additionalForm.reset({
      city: devotee.city,
      occupation: devotee.occupation,
      maritalStatus: devotee.maritalStatus,
    });
  }, [devotee]);

  const handleNext = async () => {
    let valid = false;
    if (step === 0) valid = await basicForm.trigger();
    else if (step === 1) valid = await devotionalForm.trigger();
    else if (step === 2) return handleSubmit();
    if (valid && step < 2) setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    const basic = basicForm.getValues();
    const devotional = devotionalForm.getValues();
    const additional = additionalForm.getValues();

    await updateMutation.mutateAsync({
      id: devoteeId,
      updates: {
        fullName: basic.fullName,
        mobileNumber: formatToE164(basic.mobileNumber),
        email: basic.email || null,
        gender: basic.gender,
        dateOfBirth: basic.dateOfBirth ? toTimestamp(basic.dateOfBirth) : null,
        categories: devotional.categories,
        primaryCategory: devotional.primaryCategory ?? devotional.categories[0],
        teamId: devotional.teamId,
        city: additional.city,
        occupation: additional.occupation,
        maritalStatus: additional.maritalStatus,
      },
      photoUri: photoUri ?? undefined,
    });
    navigation.goBack();
  };

  if (isLoading) {
    return <SafeAreaView style={styles.container}><ListSkeleton count={6} /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <IconButton name="close" onPress={() => navigation.goBack()} accessibilityLabel="Cancel" />
        <Text variant="title-lg" color="primary">Edit Profile</Text>
        <View style={{width: 44}} />
      </View>

      {/* Step tabs */}
      <View style={styles.stepTabs}>
        {STEPS.map((s, i) => (
          <View
            key={s}
            style={[styles.stepTab, step === i && styles.stepTabActive]}>
            <Text
              variant="label-lg"
              style={{color: step === i ? COLORS.primary : COLORS.outline}}>
              {s}
            </Text>
          </View>
        ))}
      </View>

      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {step === 0 && <BasicInfoStep form={basicForm} photoUri={photoUri ?? devotee?.photoURL ?? null} onPhotoChange={setPhotoUri} />}
          {step === 1 && <DevotionalInfoStep form={devotionalForm} />}
          {step === 2 && <AdditionalInfoStep form={additionalForm} />}
        </ScrollView>

        <View style={styles.footer}>
          {step > 0 && (
            <Button label="Back" onPress={() => setStep(s => s - 1)} variant="outline" size="lg" style={{flex: 1}} />
          )}
          <Button
            label={step === 2 ? 'Save Changes' : 'Next'}
            onPress={handleNext}
            variant="primary"
            size="lg"
            loading={updateMutation.isPending}
            style={{flex: 1}}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.sm, paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.outlineVariant,
  },
  stepTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant,
  },
  stepTab: {
    flex: 1, paddingVertical: SPACING.md, alignItems: 'center',
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  stepTabActive: {borderBottomColor: COLORS.primary},
  content: {padding: SPACING.marginMobile, paddingBottom: SPACING.xl},
  footer: {
    flexDirection: 'row', gap: SPACING.md, padding: SPACING.marginMobile,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: COLORS.outlineVariant,
    backgroundColor: COLORS.background,
  },
});
