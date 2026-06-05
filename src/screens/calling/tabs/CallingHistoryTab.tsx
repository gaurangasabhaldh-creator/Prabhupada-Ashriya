import React from 'react';
import {View, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Icon} from '@components/common/Icon/Icon';
import {EmptyState} from '@components/common/EmptyState/EmptyState';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {SubmissionStatusBadge} from '@components/calling/SubmissionStatusBadge';
import {useCallingHistory} from '@hooks/calling/useCallingHistory';
import {useCallingStore} from '@store/calling.store';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {CallingListDocument} from '@mytypes/calling.types';

interface Props {
  onSelectList: (listId: string) => void;
}

export default function CallingHistoryTab({onSelectList}: Props) {
  const {data: history = [], isLoading} = useCallingHistory();
  const setActiveListId = useCallingStore(s => s.setActiveListId);

  const handlePress = (list: CallingListDocument) => {
    setActiveListId(list.id);
    onSelectList(list.id);
  };

  if (isLoading) return <ListSkeleton count={6} />;

  if (!history.length) {
    return (
      <EmptyState
        icon="history"
        title="No History"
        message="Your previous calling lists will appear here."
      />
    );
  }

  return (
    <FlatList
      data={history}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      renderItem={({item}) => {
        const pct =
          item.totalAssigned > 0
            ? Math.round((item.totalCalled / item.totalAssigned) * 100)
            : 0;

        return (
          <TouchableOpacity
            style={styles.row}
            onPress={() => handlePress(item)}
            accessibilityRole="button">
            <View style={styles.rowLeft}>
              <Text variant="title-md">{item.teamName}</Text>
              <Text variant="body-sm" color="onSurfaceVariant">{item.weekString}</Text>
              <SubmissionStatusBadge list={item} />
            </View>
            <View style={styles.rowRight}>
              <Text variant="title-lg" color="primary">{pct}%</Text>
              <Text variant="label-sm" color="onSurfaceVariant">called</Text>
              <Icon name="chevron_right" size={20} color={COLORS.onSurfaceVariant} />
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {paddingVertical: SPACING.sm},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.marginMobile,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
  },
  rowLeft: {gap: 4},
  rowRight: {alignItems: 'flex-end', gap: 2},
});
