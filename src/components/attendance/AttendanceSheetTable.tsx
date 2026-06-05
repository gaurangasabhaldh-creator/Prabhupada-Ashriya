import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Icon} from '@components/common/Icon/Icon';
import {DevoteeDocument} from '@mytypes/devotee.types';
import {AttendanceStatus, ATTENDANCE_STATUS_COLORS} from '@constants/attendance';
import {COLORS} from '@constants/colors';
import {BORDER_RADIUS, SPACING} from '@constants/spacing';
import {formatDateShort} from '@utils/date.utils';
import {parse} from 'date-fns';

const FROZEN_W = 140;
const CELL_W = 52;
const ROW_H = 48;

const STATUS_ICONS: Record<AttendanceStatus, string> = {
  present: 'check_circle',
  absent: 'cancel',
  late: 'schedule',
  excused: 'help',
};

interface Props {
  devotees: DevoteeDocument[];
  dates: string[];
  sheetMap: Map<string, Map<string, AttendanceStatus>>;
}

export const AttendanceSheetTable: React.FC<Props> = ({devotees, dates, sheetMap}) => (
  <View style={styles.wrapper}>
    {/* Frozen left column */}
    <View style={styles.frozenCol}>
      <View style={[styles.cell, styles.headerCell, {width: FROZEN_W}]}>
        <Text variant="label-lg" color="onSurfaceVariant">DEVOTEE</Text>
      </View>
      {devotees.map(d => (
        <View key={d.id} style={[styles.cell, {width: FROZEN_W, height: ROW_H}]}>
          <Text variant="body-sm" color="onSurface" numberOfLines={1} style={{flex: 1}}>
            {d.fullName}
          </Text>
        </View>
      ))}
    </View>

    {/* Scrollable date columns */}
    <ScrollView horizontal showsHorizontalScrollIndicator>
      <View>
        {/* Date headers */}
        <View style={styles.headerRow}>
          {dates.map(ds => (
            <View key={ds} style={[styles.cell, styles.headerCell, {width: CELL_W}]}>
              <Text variant="label-md" color="onSurfaceVariant">
                {formatDateShort(parse(ds, 'yyyy-MM-dd', new Date()))}
              </Text>
            </View>
          ))}
          <View style={[styles.cell, styles.headerCell, {width: CELL_W}]}>
            <Text variant="label-md" color="primary">%</Text>
          </View>
        </View>

        {/* Data rows */}
        {devotees.map(d => {
          const devoteeMap = sheetMap.get(d.id) ?? new Map<string, AttendanceStatus>();
          const markedCount = dates.filter(ds => devoteeMap.has(ds)).length;
          const presentCount = dates.filter(ds => {
            const s = devoteeMap.get(ds);
            return s === 'present' || s === 'late';
          }).length;
          const pct = markedCount > 0 ? Math.round((presentCount / dates.length) * 100) : null;

          return (
            <View key={d.id} style={styles.dataRow}>
              {dates.map(ds => {
                const status = devoteeMap.get(ds);
                return (
                  <View key={ds} style={[styles.cell, {width: CELL_W, height: ROW_H}]}>
                    {status ? (
                      <Icon
                        name={STATUS_ICONS[status]}
                        size={18}
                        color={ATTENDANCE_STATUS_COLORS[status]}
                        filled={status === 'present'}
                      />
                    ) : (
                      <View style={styles.emptyDot} />
                    )}
                  </View>
                );
              })}
              {/* % column */}
              <View style={[styles.cell, {width: CELL_W, height: ROW_H}]}>
                {pct !== null && (
                  <Text
                    variant="label-lg"
                    style={{color: pct >= 75 ? COLORS.primary : pct >= 50 ? COLORS.tertiary : COLORS.secondary}}>
                    {pct}%
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {flexDirection: 'row', flex: 1},
  frozenCol: {
    borderRightWidth: 1,
    borderRightColor: COLORS.outlineVariant,
    backgroundColor: COLORS.surfaceContainerLowest,
    zIndex: 1,
  },
  headerRow: {flexDirection: 'row'},
  dataRow: {flexDirection: 'row'},
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
  },
  headerCell: {
    height: 44,
    backgroundColor: COLORS.surfaceContainerLow,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant,
  },
  emptyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.surfaceContainerHigh,
  },
});
