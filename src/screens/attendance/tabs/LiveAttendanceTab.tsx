import React, {useCallback, useMemo, useState} from 'react';
import {View, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, TextInput} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {DateNavigator} from '@components/attendance/DateNavigator';
import {AttendanceStatsBar} from '@components/attendance/AttendanceStatsBar';
import {DevoteeAttendanceRow} from '@components/attendance/DevoteeAttendanceRow';
import {SessionLockBanner} from '@components/attendance/SessionLockBanner';
import {Chip} from '@components/common/Chip/Chip';
import {Button} from '@components/common/Button/Button';
import {FAB} from '@components/common/Button/FAB';
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
import {ALL_CATEGORIES, CATEGORY_LABELS} from '@constants/categories';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

export default function LiveAttendanceTab() {
  const {selectedDate, selectedCategory, setSelectedDate, setSelectedCategory, pendingMarks, isDirty} =
    useAttendanceStore();
  const {user} = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState<string>('');

  const {data: session, isLoading: sessionLoading} = useAttendanceSession(selectedDate, selectedCategory);
  const {statusMap} = useAttendanceRecords(session?.id ?? null);
  const {data: devoteePages, isLoading: devoteesLoading, refetch, isRefetching} = useDevotees({
    teamId: teamFilter || undefined,
  });

  const allDevotees: DevoteeDocument[] = useMemo(
    () => devoteePages?.pages.flatMap(p => p.data) ?? [],
    [devoteePages],
  );

  const filteredDevotees = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return allDevotees;
    return allDevotees.filter(
      d => d.fullName.toLowerCase().includes(term) || d.mobileNumber.includes(term),
    );
  }, [allDevotees, searchTerm]);

  const stats = useAttendanceStats(session?.id ?? null, allDevotees.length);
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
      {/* Date & Category */}
      <View style={styles.controls}>
        <DateNavigator date={selectedDate} onChange={setSelectedDate} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
          {ALL_CATEGORIES.map(cat => {
            const selected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, selected && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                activeOpacity={0.7}>
                {selected ? (
                  <LinearGradient
                    colors={['#FF8F00', '#E65100']}
                    style={styles.categoryGradient}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}>
                    <Text style={styles.categoryTextActive}>{CATEGORY_LABELS[cat]}</Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.categoryText}>{CATEGORY_LABELS[cat]}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {!selectedCategory ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Icon name="calendar-check" size={48} color="#FF8F00" />
          </View>
          <Text style={styles.emptyTitle}>Select a Team to Start</Text>
          <Text style={styles.emptySubtitle}>Choose a category above to view devotees and mark attendance live</Text>
        </View>
      ) : (
        <>
          {/* Stats Cards */}
          <View style={styles.statsRow}>
            <View style={[styles.miniStatCard, {borderLeftColor: '#D4AF37'}]}>
              <Icon name="account-group" size={16} color="#D4AF37" />
              <Text style={styles.miniStatValue}>{stats.total}</Text>
              <Text style={styles.miniStatLabel}>Total</Text>
            </View>
            <View style={[styles.miniStatCard, {borderLeftColor: '#4CAF50'}]}>
              <Icon name="check-circle" size={16} color="#4CAF50" />
              <Text style={styles.miniStatValue}>{stats.present}</Text>
              <Text style={styles.miniStatLabel}>Present</Text>
            </View>
            <View style={[styles.miniStatCard, {borderLeftColor: '#FF5252'}]}>
              <Icon name="close-circle" size={16} color="#FF5252" />
              <Text style={styles.miniStatValue}>{stats.absent}</Text>
              <Text style={styles.miniStatLabel}>Absent</Text>
            </View>
            <View style={[styles.miniStatCard, {borderLeftColor: '#6A1B9A'}]}>
              <Icon name="chart-line" size={16} color="#6A1B9A" />
              <Text style={styles.miniStatValue}>{stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%</Text>
              <Text style={styles.miniStatLabel}>Rate</Text>
            </View>
          </View>

          {/* Search */}
          <View style={styles.searchRow}>
            <View style={styles.searchContainer}>
              <Icon name="magnify" size={20} color="#B0A89A" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name or phone..."
                placeholderTextColor="#6E6A62"
                onChangeText={setSearchTerm}
                value={searchTerm}
                disableFullscreenUI={true}
              />
              {searchTerm.length > 0 && (
                <TouchableOpacity onPress={() => setSearchTerm('')}>
                  <Icon name="close-circle" size={18} color="#6E6A62" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Batch Actions */}
          {!sessionLocked && (
            <View style={styles.batchRow}>
              <TouchableOpacity
                style={styles.batchBtn}
                onPress={() => markAll(filteredDevotees, ATTENDANCE_STATUS.PRESENT)}
                activeOpacity={0.7}>
                <Icon name="check-all" size={16} color="#4CAF50" />
                <Text style={[styles.batchBtnText, {color: '#4CAF50'}]}>All Present</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.batchBtn}
                onPress={() => markAll(filteredDevotees, ATTENDANCE_STATUS.ABSENT)}
                activeOpacity={0.7}>
                <Icon name="close" size={16} color="#FF5252" />
                <Text style={[styles.batchBtnText, {color: '#FF5252'}]}>All Absent</Text>
              </TouchableOpacity>
            </View>
          )}

          {sessionLocked && <SessionLockBanner />}

          {/* Devotee List */}
          {filteredDevotees.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="account-search" size={40} color="#6E6A62" />
              <Text style={styles.emptyTitle}>No devotees found</Text>
              <Text style={styles.emptySubtitle}>
                {searchTerm ? `No results for "${searchTerm}"` : 'No devotees in this category'}
              </Text>
            </View>
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
                  tintColor="#FF8F00"
                  colors={['#FF8F00']}
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
  container: {flex: 1, backgroundColor: '#1A1A2E'},
  controls: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  categories: {gap: SPACING.sm},
  categoryChip: {
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  categoryChipActive: {},
  categoryGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  categoryText: {
    color: '#B0A89A',
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#25253E',
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: '#353555',
    overflow: 'hidden',
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  miniStatCard: {
    flex: 1,
    backgroundColor: '#25253E',
    borderRadius: 12,
    padding: SPACING.sm,
    alignItems: 'center',
    gap: 2,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: '#353555',
  },
  miniStatValue: {color: '#F5F0E8', fontSize: 18, fontWeight: '800'},
  miniStatLabel: {color: '#B0A89A', fontSize: 9, fontWeight: '600', letterSpacing: 0.3},
  // Search
  searchRow: {paddingHorizontal: SPACING.lg, marginBottom: SPACING.sm},
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25253E',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: '#353555',
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    color: '#F5F0E8',
    fontSize: 14,
    paddingVertical: 10,
  },
  // Batch
  batchRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  batchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#25253E',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#353555',
  },
  batchBtnText: {fontSize: 12, fontWeight: '700'},
  // Empty
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,143,0,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  emptyTitle: {color: '#F5F0E8', fontSize: 18, fontWeight: '700'},
  emptySubtitle: {color: '#B0A89A', fontSize: 13, textAlign: 'center', lineHeight: 20},
  // List
  listContent: {paddingBottom: 120, paddingHorizontal: SPACING.lg},
});
