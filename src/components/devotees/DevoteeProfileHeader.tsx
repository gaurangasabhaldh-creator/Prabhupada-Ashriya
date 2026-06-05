import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Avatar} from '@components/common/Avatar/Avatar';
import {Text} from '@components/common/Typography/Text';
import {StatusChip} from '@components/common/Chip/StatusChip';
import {CategoryBadge} from './CategoryBadge';
import {DevoteeDocument} from '@mytypes/devotee.types';
import {COLORS} from '@constants/colors';
import {SPACING} from '@constants/spacing';
import {format} from 'date-fns';

interface Props {
  devotee: DevoteeDocument;
}

export const DevoteeProfileHeader: React.FC<Props> = ({devotee}) => {
  const joinDate = devotee.joiningDate
    ? format(devotee.joiningDate.toDate(), 'MMM yyyy')
    : null;

  return (
    <View style={styles.container}>
      <Avatar uri={devotee.photoURL} name={devotee.fullName} size="xl" borderColor={COLORS.primaryFixed} />

      <Text variant="headline-sm" color="onSurface" align="center" style={styles.name}>
        {devotee.fullName}
      </Text>

      <StatusChip status={devotee.status} style={styles.statusChip} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}>
        {devotee.categories.map(cat => (
          <CategoryBadge key={cat} category={cat} />
        ))}
      </ScrollView>

      <View style={styles.meta}>
        {devotee.mentorName && (
          <Text variant="body-sm" color="onSurfaceVariant">
            Mentor: {devotee.mentorName}
          </Text>
        )}
        {joinDate && (
          <Text variant="body-sm" color="onSurfaceVariant">
            Since {joinDate}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.marginMobile,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
  },
  name: {marginTop: SPACING.md, marginBottom: SPACING.sm},
  statusChip: {marginBottom: SPACING.sm},
  categories: {gap: SPACING.sm, paddingHorizontal: SPACING.sm, marginBottom: SPACING.sm},
  meta: {flexDirection: 'row', gap: SPACING.lg, marginTop: SPACING.xs},
});
