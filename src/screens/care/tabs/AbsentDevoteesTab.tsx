import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {Text} from '@components/common/Typography/Text';
import {EmptyState} from '@components/common/EmptyState/EmptyState';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {DateNavigator} from '@components/attendance/DateNavigator';
import {AbsentDevoteeCard} from '@components/care/AbsentDevoteeCard';
import {useAbsentDevotees} from '@hooks/care/useAbsentDevotees';
import {COLORS} from '@constants/colors';
import {SPACING} from '@constants/spacing';

export default function AbsentDevoteesTab() {
  const [date, setDate] = useState(new Date());
  const {data: records = [], isLoading} = useAbsentDevotees(date);

  return (
    <View style={styles.container}>
      <DateNavigator date={date} onDateChange={setDate} />

      <View style={styles.summary}>
        <Text variant="body-md" color="onSurfaceVariant">
          {records.length} absent devotee{records.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {isLoading ? (
        <ListSkeleton count={6} />
      ) : records.length === 0 ? (
        <EmptyState
          icon="check_circle"
          title="No Absences"
          message="No absent devotees for this date."
        />
      ) : (
        <FlashList
          data={records}
          keyExtractor={item => item.id}
          estimatedItemSize={72}
          renderItem={({item}) => <AbsentDevoteeCard record={item} />}
          contentContainerStyle={{paddingBottom: 80}}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  summary: {
    paddingHorizontal: SPACING.marginMobile,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant,
  },
});
