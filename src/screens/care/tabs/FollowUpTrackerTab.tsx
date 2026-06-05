import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {Text} from '@components/common/Typography/Text';
import {Chip} from '@components/common/Chip/Chip';
import {EmptyState} from '@components/common/EmptyState/EmptyState';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {FollowUpCard} from '@components/care/FollowUpCard';
import {useFollowUps} from '@hooks/care/useFollowUps';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '@constants/colors';
import {SPACING} from '@constants/spacing';
import {FOLLOW_UP_STATUS} from '@constants/callStatus';
import {FollowUpDocument} from '@mytypes/followUp.types';

const FILTER_OPTIONS = [
  {id: 'all', label: 'All'},
  {id: FOLLOW_UP_STATUS.NOT_CONTACTED, label: 'Not Contacted'},
  {id: FOLLOW_UP_STATUS.CONTACTED, label: 'Contacted'},
  {id: FOLLOW_UP_STATUS.RESPONDED, label: 'Responded'},
  {id: FOLLOW_UP_STATUS.WILL_ATTEND_NEXT, label: 'Will Attend'},
  {id: FOLLOW_UP_STATUS.REQUIRES_FURTHER_FOLLOWUP, label: 'Needs More'},
];

export default function FollowUpTrackerTab() {
  const {data: followUps = [], isLoading} = useFollowUps();
  const [activeFilter, setActiveFilter] = useState('all');
  const navigation = useNavigation<any>();

  const filtered =
    activeFilter === 'all'
      ? followUps
      : followUps.filter(f => f.status === activeFilter);

  return (
    <View style={styles.container}>
      {/* Filter chips */}
      <View style={styles.filtersWrapper}>
        <FlashList
          data={FILTER_OPTIONS}
          horizontal
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={80}
          contentContainerStyle={styles.filters}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <Chip
              label={item.label}
              selected={activeFilter === item.id}
              onPress={() => setActiveFilter(item.id)}
            />
          )}
        />
      </View>

      <View style={styles.countRow}>
        <Text variant="body-sm" color="onSurfaceVariant">
          {filtered.length} follow-up{filtered.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {isLoading ? (
        <ListSkeleton count={5} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="task_alt"
          title="All Clear"
          message="No follow-ups match the selected filter."
        />
      ) : (
        <FlashList
          data={filtered}
          keyExtractor={item => item.id}
          estimatedItemSize={80}
          renderItem={({item}) => (
            <FollowUpCard
              followUp={item}
              onPress={() =>
                navigation.navigate('FollowUpDetail', {followUpId: item.id})
              }
            />
          )}
          contentContainerStyle={{paddingBottom: 80}}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  filtersWrapper: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
  },
  filters: {paddingHorizontal: SPACING.marginMobile, paddingVertical: SPACING.sm},
  countRow: {
    paddingHorizontal: SPACING.marginMobile,
    paddingVertical: SPACING.xs,
  },
});
