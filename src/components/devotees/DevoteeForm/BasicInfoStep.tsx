import React, {useState} from 'react';
import {View, TouchableOpacity, Image, StyleSheet, Alert} from 'react-native';
import {Controller, UseFormReturn} from 'react-hook-form';
import {TextInput} from '@components/common/Input/TextInput';
import {Text} from '@components/common/Typography/Text';
import {Avatar} from '@components/common/Avatar/Avatar';
import {Icon} from '@components/common/Icon/Icon';
import {Chip} from '@components/common/Chip/Chip';
import {DevoteeBasicInfoData} from '@utils/validation.utils';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {launchImageLibrary} from 'react-native-image-picker';
import {MAX_IMAGE_SIZE_BYTES} from '@services/firebase/storage.service';

interface Props {
  form: UseFormReturn<DevoteeBasicInfoData>;
  photoUri: string | null;
  onPhotoChange: (uri: string | null) => void;
}

const GENDERS = [{value: 'male', label: 'Male'}, {value: 'female', label: 'Female'}, {value: 'other', label: 'Other'}];

export const BasicInfoStep: React.FC<Props> = ({form, photoUri, onPhotoChange}) => {
  const {control, formState: {errors}} = form;

  const pickPhoto = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
      maxWidth: 400,
      maxHeight: 400,
    });
    if (!result.didCancel && result.assets?.[0]) {
      const asset = result.assets[0];
      if ((asset.fileSize ?? 0) > MAX_IMAGE_SIZE_BYTES) {
        Alert.alert('Image too large', 'Please select an image under 2MB.');
        return;
      }
      onPhotoChange(asset.uri ?? null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Photo picker */}
      <TouchableOpacity style={styles.photoPicker} onPress={pickPhoto} accessibilityLabel="Add profile photo">
        {photoUri ? (
          <Image source={{uri: photoUri}} style={styles.photoPreview} />
        ) : (
          <Avatar name="?" size="xl" />
        )}
        <View style={styles.photoEditBadge}>
          <Icon name="photo_camera" size={14} color={COLORS.onPrimary} />
        </View>
      </TouchableOpacity>

      <View style={styles.fields}>
        <Controller
          control={control}
          name="fullName"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput label="Full Name *" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.fullName?.message} autoCapitalize="words" returnKeyType="next" />
          )}
        />

        <Controller
          control={control}
          name="mobileNumber"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput label="Mobile Number *" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.mobileNumber?.message} keyboardType="phone-pad" maxLength={13} />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput label="Email (optional)" onChangeText={onChange} onBlur={onBlur} value={value ?? ''} error={errors.email?.message} keyboardType="email-address" autoCapitalize="none" />
          )}
        />

        {/* Gender */}
        <Controller
          control={control}
          name="gender"
          render={({field: {onChange, value}}) => (
            <View>
              <Text variant="label-lg" color="onSurfaceVariant" style={{marginBottom: SPACING.sm}}>Gender</Text>
              <View style={styles.chips}>
                {GENDERS.map(g => (
                  <Chip key={g.value} label={g.label} selected={value === g.value} onPress={() => onChange(g.value)} />
                ))}
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {gap: SPACING.lg},
  photoPicker: {alignSelf: 'center', marginBottom: SPACING.sm},
  photoPreview: {width: 80, height: 80, borderRadius: 40},
  photoEditBadge: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.full,
    width: 26, height: 26, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: COLORS.background,
  },
  fields: {gap: SPACING.md},
  chips: {flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap'},
});
