import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Avatar} from '@components/common/Avatar/Avatar';
import {Icon} from '@components/common/Icon/Icon';
import {EmptyState} from '@components/common/EmptyState/EmptyState';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {useInactiveDevotees} from '@hooks/care/useInactiveDevotees';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';

export default function InactiveDevoteesTab() {
  const {data: inactive = [], isLoading} = useInactiveDevotees();

  if (isLoading) return <ListSkeleton count={6} />;

  if (!inactive.length) {
    return (
      <EmptyState
        icon="favorite"
        title="All Active!"
        message="No devotees have 3+ consecutive absences."
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="body-md" color="onSurfaceVariant">
          {inactive.length} inactive devotee{inactive.length !== 1 ? 's' : ''} — sorted by absences
        </Text>
      </View>

      <FlatList
        data={inactive}
        keyExtractor={item => item.devoteeId}
        contentContainerStyle={{paddingBottom: 80}}
        renderItem={({item, index}) => (
          <View style={[
            styles.row,
            item.absences >= 5 && {backgroundColor: COLORS.secondaryFixed + '30'},
          ]}>
            <View style={styles.rank}>
              <Text variant="title-lg" color={item.absences >= 5 ? 'secondary' : 'onSurfaceVariant'}>
                {item.absences}
              </Text>
              <Text variant="label-sm" color="onSurfaceVariant">absences</Text>
            </View>
            <Avatar name={item.devoteeName || item.devoteeId.slice(0, 2)} size="md" />
            <View style={styles.info}>
              <Text variant="title-md">{item.devoteeName || item.devoteeId}</Text>
              {item.lastSeen && (
                <Text variant="body-sm" color="onSurfaceVariant">Last seen: {item.lastSeen}</Text>
              )}
            </View>
            {item.absences >= 5 && (
              <Icon name="warning" size={20} color={COLORS.secondary} filled />
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  header: {
    paddingHorizontal: SPACING.marginMobile,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.marginMobile,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
  },
  rank: {alignItems: 'center', width: 44},
  info: {flex: 1, gap: 2},
});
