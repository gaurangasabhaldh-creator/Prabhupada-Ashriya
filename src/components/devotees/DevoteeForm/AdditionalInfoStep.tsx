import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Controller, UseFormReturn} from 'react-hook-form';
import {TextInput} from '@components/common/Input/TextInput';
import {Text} from '@components/common/Typography/Text';
import {Chip} from '@components/common/Chip/Chip';
import {DevoteeAdditionalInfoData} from '@utils/validation.utils';
import {MaritalStatus} from '@mytypes/devotee.types';
import {SPACING} from '@constants/spacing';

interface Props {
  form: UseFormReturn<DevoteeAdditionalInfoData>;
}

const MARITAL_OPTIONS: {value: MaritalStatus; label: string}[] = [
  {value: 'single', label: 'Single'},
  {value: 'married', label: 'Married'},
  {value: 'widowed', label: 'Widowed'},
  {value: 'divorced', label: 'Divorced'},
];

export const AdditionalInfoStep: React.FC<Props> = ({form}) => {
  const {control, formState: {errors}, setValue, watch} = form;
  const maritalStatus = watch('maritalStatus');

  return (
    <View style={styles.container}>
      <Text variant="body-md" color="onSurfaceVariant" style={styles.hint}>
        All fields on this step are optional.
      </Text>

      <Controller
        control={control}
        name="city"
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput label="City" onChangeText={onChange} onBlur={onBlur} value={value ?? ''} error={errors.city?.message} autoCapitalize="words" />
        )}
      />

      <Controller
        control={control}
        name="occupation"
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput label="Occupation / Profession" onChangeText={onChange} onBlur={onBlur} value={value ?? ''} error={errors.occupation?.message} autoCapitalize="words" />
        )}
      />

      <View>
        <Text variant="label-lg" color="onSurfaceVariant" style={{marginBottom: SPACING.sm}}>
          Marital Status
        </Text>
        <View style={styles.chips}>
          {MARITAL_OPTIONS.map(opt => (
            <Chip
              key={opt.value}
              label={opt.label}
              selected={maritalStatus === opt.value}
              onPress={() => setValue('maritalStatus', maritalStatus === opt.value ? null : opt.value)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {gap: SPACING.lg},
  hint: {marginBottom: SPACING.xs},
  chips: {flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap'},
});
