import React, {useCallback, useMemo, useState} from 'react';
import {View, ScrollView, StyleSheet, RefreshControl} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {DateNavigator} from '@components/attendance/DateNavigator';
import {AttendanceStatsBar} from '@components/attendance/AttendanceStatsBar';
import {DevoteeAttendanceRow} from '@components/attendance/DevoteeAttendanceRow';
import {SessionLockBanner} from '@components/attendance/SessionLockBanner';
import {SearchInput} from '@components/common/Input/SearchInput';
import {Chip} from '@components/common/Chip/Chip';
import {Button} from '@components/common/Button/Button';
import {FAB} from '@components/common/Button/FAB';
import {EmptyState} from '@components/common/EmptyState/EmptyState';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {Text} from '@components/common/Typography/Text';
import {useAttendanceStore} from '@store/attendance.store';
import {useAttendanceSession} from '@hooks/attendance/useAttendanceSession';
import {useAttendanceRecords} from '@hooks/attendance/useAttendanceRecords';
import {useAttendanceStats} from '@hooks/attendance/useAttendanceStats';
import {useMarkAttendance} from '@hooks/attendance/useMarkAttendance';
import {useBatchMarkAttendance} from '@hooks/attendance/useBatchMarkAttendance';
import {useSaveAttendance} from '@hooks/attendance/useSaveAttendance';
import {useDevotees} from '@hooks/devotees/useDevotees';
import {useAuth} from '@hooks/auth/useAuth';
import {DevoteeDocument} from '@mytypes/devotee.types';
import {AttendanceStatus, ATTENDANCE_STATUS} from '@constants/attendance';
import {ALL_CATEGORIES, CATEGORY_LABELS, DevoteeCategory} from '@constants/categories';
import {COLORS} from '@constants/colors';
import {SPACING} from '@constants/spacing';
import {toDateString} from '@utils/date.utils';

export default function LiveAttendanceTab() {
  const {selectedDate, selectedCategory, setSelectedDate, setSelectedCategory, pendingMarks, isDirty} =
    useAttendanceStore();
  const {user} = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState<string>('');

  // Session
  const {data: session, isLoading: sessionLoading} = useAttendanceSession(
    selectedDate,
    selectedCategory,
  );

  // Records (real-time)
  const {statusMap} = useAttendanceRecords(session?.id ?? null);

  // All devotees (source of truth for the list)
  const {data: devoteePages, isLoading: devoteesLoading, refetch, isRefetching} = useDevotees({
    teamId: teamFilter || undefined,
  });

  const allDevotees: DevoteeDocument[] = useMemo(
    () => devoteePages?.pages.flatMap(p => p.data) ?? [],
    [devoteePages],
  );

  // Filtered devotees
  const filteredDevotees = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return allDevotees;
    return allDevotees.filter(
      d =>
        d.fullName.toLowerCase().includes(term) ||
        d.mobileNumber.includes(term),
    );
  }, [allDevotees, searchTerm]);

  // Stats (real stats from records + pending)
  const stats = useAttendanceStats(session?.id ?? null, allDevotees.length);

  // Mutations
  const {mark} = useMarkAttendance();
  const {markAll} = useBatchMarkAttendance();
  const saveMutation = useSaveAttendance();

  const handleMark = useCallback(
    (devotee: DevoteeDocument, status: AttendanceStatus, arrivalTime?: Date) => {
      mark(devotee, status, arrivalTime);
    },
    [mark],
  );

  const handleSave = () => {
    if (session) saveMutation.mutate(session);
  };

  const sessionLocked = session ? !session.isOpen : false;
  const pendingCount = Object.keys(pendingMarks).length;
  const isLoading = sessionLoading || devoteesLoading;

  const renderItem = useCallback(
    ({item}: {item: DevoteeDocument}) => {
      const currentStatus: AttendanceStatus | null =
        pendingMarks[item.id]?.status ?? statusMap.get(item.id) ?? null;
      return (
        <DevoteeAttendanceRow
          devotee={item}
          status={currentStatus}
          onMark={handleMark}
          disabled={sessionLocked}
        />
      );
    },
    [pendingMarks, statusMap, handleMark, sessionLocked],
  );

  if (isLoading) return <ListSkeleton count={10} />;

  return (
    <View style={styles.container}>
      {/* Date nav + category filter */}
      <View style={styles.controls}>
        <DateNavigator date={selectedDate} onChange={setSelectedDate} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}>
          {ALL_CATEGORIES.map(cat => (
            <Chip
              key={cat}
              label={CATEGORY_LABELS[cat]}
              selected={selectedCategory === cat}
              onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            />
          ))}
        </ScrollView>
      </View>

      {!selectedCategory ? (
        <View style={styles.selectPrompt}>
          <Text variant="body-md" color="onSurfaceVariant" align="center">
            Select a category above to start marking attendance
          </Text>
        </View>
      ) : (
        <>
          {/* Stats */}
          <AttendanceStatsBar
            total={stats.total}
            present={stats.present}
            absent={stats.absent}
            excused={stats.excused}
          />

          {/* Search */}
          <View style={styles.searchRow}>
            <SearchInput
              placeholder="Search devotees..."
              onChangeText={setSearchTerm}
            />
          </View>

          {/* Batch actions */}
          {!sessionLocked && (
            <View style={styles.batchRow}>
              <Button
                label="Mark All Present"
                leftIcon="done_all"
                variant="outline"
                size="sm"
                onPress={() => markAll(filteredDevotees, ATTENDANCE_STATUS.PRESENT)}
              />
              <Button
                label="Mark All Absent"
                leftIcon="close"
                variant="outline"
                size="sm"
                onPress={() => markAll(filteredDevotees, ATTENDANCE_STATUS.ABSENT)}
              />
            </View>
          )}

          {sessionLocked && <SessionLockBanner />}

          {/* List */}
          {filteredDevotees.length === 0 ? (
            <EmptyState
              icon="group"
              title="No devotees found"
              message={searchTerm ? `No results for "${searchTerm}"` : 'No devotees in this category.'}
            />
          ) : (
            <FlashList
              data={filteredDevotees}
              renderItem={renderItem}
              estimatedItemSize={72}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={isRefetching}
                  onRefresh={refetch}
                  tintColor={COLORS.primary}
                  colors={[COLORS.primary]}
                />
              }
            />
          )}

          {/* Save FAB */}
          <FAB
            icon="done_all"
            label={pendingCount > 0 ? `Save (${pendingCount})` : 'Save'}
            onPress={handleSave}
            loading={saveMutation.isPending}
            visible={isDirty && !sessionLocked}
            badgeCount={pendingCount}
            pulse={pendingCount > 0}
            accessibilityLabel={`Save attendance, ${pendingCount} unsaved changes`}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  controls: {
    paddingHorizontal: SPACING.marginMobile,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  categories: {gap: SPACING.sm},
  selectPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  searchRow: {paddingHorizontal: SPACING.marginMobile, marginBottom: SPACING.sm},
  batchRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.marginMobile,
    marginBottom: SPACING.sm,
  },
  listContent: {paddingBottom: 120},
});
