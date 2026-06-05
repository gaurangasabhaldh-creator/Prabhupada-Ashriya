import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Controller, UseFormReturn} from 'react-hook-form';
import {Text} from '@components/common/Typography/Text';
import {Chip} from '@components/common/Chip/Chip';
import {TextInput} from '@components/common/Input/TextInput';
import {DevoteeDevotionalInfoData} from '@utils/validation.utils';
import {ALL_CATEGORIES, CATEGORY_LABELS, CATEGORY_COLORS, DevoteeCategory} from '@constants/categories';
import {SPACING} from '@constants/spacing';
import {useTeams} from '@hooks/devotees/useTeams';

interface Props {
  form: UseFormReturn<DevoteeDevotionalInfoData>;
}

export const DevotionalInfoStep: React.FC<Props> = ({form}) => {
  const {control, formState: {errors}, watch, setValue} = form;
  const {data: teams = []} = useTeams();
  const selectedCategories = watch('categories') ?? [];
  const primaryCategory = watch('primaryCategory');
  const selectedTeamId = watch('teamId');

  const toggleCategory = (cat: DevoteeCategory) => {
    const current: DevoteeCategory[] = selectedCategories;
    const next = current.includes(cat) ? current.filter(c => c !== cat) : [...current, cat];
    setValue('categories', next, {shouldValidate: true});
    // Auto-set primary if none selected
    if (next.length === 1) setValue('primaryCategory', next[0], {shouldValidate: true});
    if (primaryCategory && !next.includes(primaryCategory) && next.length > 0) {
      setValue('primaryCategory', next[0], {shouldValidate: true});
    }
  };

  return (
    <View style={styles.container}>
      {/* Category multi-select */}
      <View>
        <Text variant="label-lg" color="onSurfaceVariant" style={styles.label}>
          Categories * (select all that apply)
        </Text>
        <View style={styles.chips}>
          {ALL_CATEGORIES.map(cat => (
            <Chip
              key={cat}
              label={CATEGORY_LABELS[cat]}
              selected={selectedCategories.includes(cat)}
              onPress={() => toggleCategory(cat)}
              color={CATEGORY_COLORS[cat]}
            />
          ))}
        </View>
        {errors.categories && (
          <Text variant="body-sm" color="error" style={{marginTop: 4}}>
            {errors.categories.message}
          </Text>
        )}
      </View>

      {/* Primary category — only shown if multiple selected */}
      {selectedCategories.length > 1 && (
        <View>
          <Text variant="label-lg" color="onSurfaceVariant" style={styles.label}>
            Primary Category *
          </Text>
          <View style={styles.chips}>
            {selectedCategories.map(cat => (
              <Chip
                key={cat}
                label={CATEGORY_LABELS[cat]}
                selected={primaryCategory === cat}
                onPress={() => setValue('primaryCategory', cat, {shouldValidate: true})}
                color={CATEGORY_COLORS[cat]}
              />
            ))}
          </View>
        </View>
      )}

      {/* Team selector */}
      <View>
        <Text variant="label-lg" color="onSurfaceVariant" style={styles.label}>
          Team *
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.teamRow}>
          {teams.map(team => (
            <Chip
              key={team.id}
              label={team.name}
              selected={selectedTeamId === team.id}
              onPress={() => setValue('teamId', team.id, {shouldValidate: true})}
            />
          ))}
        </ScrollView>
        {errors.teamId && (
          <Text variant="body-sm" color="error" style={{marginTop: 4}}>
            {errors.teamId.message}
          </Text>
        )}
      </View>

      {/* Joining Date */}
      <Controller
        control={control}
        name="joiningDate"
        render={({field: {value}}) => (
          <TextInput
            label="Joining Date *"
            value={value ? value.toLocaleDateString('en-IN') : ''}
            editable={false}
            rightIcon="calendar_today"
            error={errors.joiningDate?.message}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {gap: SPACING.lg},
  label: {marginBottom: SPACING.sm},
  chips: {flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap'},
  teamRow: {gap: SPACING.sm, paddingBottom: SPACING.xs},
});
