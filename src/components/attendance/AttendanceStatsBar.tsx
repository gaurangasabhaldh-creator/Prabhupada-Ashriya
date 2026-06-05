import React from 'react';
import {View, StyleSheet} from 'react-native';
import {StatCard} from '@components/common/Card/StatCard';
import {SPACING} from '@constants/spacing';

interface Props {
  total: number;
  present: number;
  absent: number;
  excused: number;
}

export const AttendanceStatsBar: React.FC<Props> = ({total, present, absent, excused}) => (
  <View style={styles.row}>
    <StatCard label="Total" value={total} color="outline" style={{flex: 1}} />
    <StatCard label="Present" value={present} color="primary" style={{flex: 1}} />
    <StatCard label="Absent" value={absent} color="secondary" style={{flex: 1}} />
    <StatCard label="Excused" value={excused} color="tertiary" style={{flex: 1}} />
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.marginMobile,
    marginBottom: SPACING.sm,
  },
});
