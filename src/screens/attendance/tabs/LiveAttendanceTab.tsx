import React, {useCallback, useMemo, useState} from 'react';
import {View, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, TextInput} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {DateNavigator} from '@components/attendance/DateNavigator';
import {DevoteeAttendanceRow} from '@components/attendance/DevoteeAttendanceRow';
import {SessionLockBanner} from '@components/attendance/SessionLockBanner';
import {Chip} from '@components/common/Chip/Chip';
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
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

export default function LiveAttendanceTab() {
  const {selectedDate, selectedCategory, setSelectedDate, setSelectedCategory, pendingMarks, isDirty} = useAttendanceStore();
  const {user} = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState<string>('');

  const {data: session, isLoading: sessionLoading} = useAttendanceSession(selectedDate, selectedCategory);
  const {statusMap} = useAttendanceRecords(session?.id ?? null);
  const {data: devoteePages, isLoading: devoteesLoading, refetch, isRefetching} = useDevotees({teamId: teamFilter || undefined});

  const allDevotees: DevoteeDocument[] = useMemo(() => devoteePages?.pages.flatMap(p => p.data) ?? [], [devoteePages]);
  const filteredDevotees = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return allDevotees;
    return allDevotees.filter(d => d.fullName.toLowerCase().includes(term) || d.mobileNumber.includes(term));
  }, [allDevotees, searchTerm]);

  const stats = useAttendanceStats(session?.id ?? null, allDevotees.length);
  const {mark} = useMarkAttendance();
  const {markAll} = useBatchMarkAttendance();
  const saveMutation = useSaveAttendance();

  const handleMark = useCallback((devotee: DevoteeDocument, status: AttendanceStatus, arrivalTime?: Date) => { mark(devotee, status, arrivalTime); }, [mark]);
  const handleSave = () => { if (session) saveMutation.mutate(session); };

  const sessionLocked = session ? !session.isOpen : false;
  const pendingCount = Object.keys(pendingMarks).length;
  const isLoading = sessionLoading || devoteesLoading;

  const renderItem = useCallback(({item}: {item: DevoteeDocument}) => {
    const currentStatus: AttendanceStatus | null = pendingMarks[item.id]?.status ?? statusMap.get(item.id) ?? null;
    return <DevoteeAttendanceRow devotee={item} status={currentStatus} onMark={handleMark} disabled={sessionLocked} />;
  }, [pendingMarks, statusMap, handleMark, sessionLocked]);

  if (isLoading) return <ListSkeleton count={10} />;

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <DateNavigator date={selectedDate} onChange={setSelectedDate} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
          {ALL_CATEGORIES.map(cat => {
            const selected = selectedCategory === cat;
            return (
              <TouchableOpacity key={cat} onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)} activeOpacity={0.7}>
                {selected ? (
                  <LinearGradient colors={['#FF8F00', '#F57C00']} style={styles.chipActive}>
                    <Text style={styles.chipActiveText}>{CATEGORY_LABELS[cat]}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.chipInactive}>
                    <Text style={styles.chipInactiveText}>{CATEGORY_LABELS[cat]}</Text>
                  </View>
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
          <View style={styles.statsRow}>
            <View style={styles.miniStat}>
              <Icon name="account-group" size={18} color="#FF8F00" />
              <Text style={[styles.miniStatVal, {color: '#FF8F00'}]}>{stats.total}</Text>
              <Text style={styles.miniStatLbl}>Total</Text>
            </View>
            <View style={styles.miniStat}>
              <Icon name="check-circle" size={18} color="#2E7D32" />
              <Text style={[styles.miniStatVal, {color: '#2E7D32'}]}>{stats.present}</Text>
              <Text style={styles.miniStatLbl}>Present</Text>
            </View>
            <View style={styles.miniStat}>
              <Icon name="close-circle" size={18} color="#D32F2F" />
              <Text style={[styles.miniStatVal, {color: '#D32F2F'}]}>{stats.absent}</Text>
              <Text style={styles.miniStatLbl}>Absent</Text>
            </View>
            <View style={styles.miniStat}>
              <Icon name="chart-line" size={18} color="#6A1B9A" />
              <Text style={[styles.miniStatVal, {color: '#6A1B9A'}]}>{stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%</Text>
              <Text style={styles.miniStatLbl}>Rate</Text>
            </View>
          </View>

          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Icon name="magnify" size={20} color="#9E9E9E" />
              <TextInput style={styles.searchInput} placeholder="Search by name or phone..." placeholderTextColor="#9E9E9E" onChangeText={setSearchTerm} value={searchTerm} disableFullscreenUI={true} />
              {searchTerm.length > 0 && (
                <TouchableOpacity onPress={() => setSearchTerm('')}><Icon name="close-circle" size={18} color="#BDBDBD" /></TouchableOpacity>
              )}
            </View>
          </View>

          {!sessionLocked && (
            <View style={styles.batchRow}>
              <TouchableOpacity style={styles.batchBtn} onPress={() => markAll(filteredDevotees, ATTENDANCE_STATUS.PRESENT)} activeOpacity={0.7}>
                <Icon name="check-all" size={16} color="#2E7D32" />
                <Text style={[styles.batchText, {color: '#2E7D32'}]}>All Present</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.batchBtn} onPress={() => markAll(filteredDevotees, ATTENDANCE_STATUS.ABSENT)} activeOpacity={0.7}>
                <Icon name="close" size={16} color="#D32F2F" />
                <Text style={[styles.batchText, {color: '#D32F2F'}]}>All Absent</Text>
              </TouchableOpacity>
            </View>
          )}

          {sessionLocked && <SessionLockBanner />}

          {filteredDevotees.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="account-search" size={40} color="#BDBDBD" />
              <Text style={styles.emptyTitle}>No devotees found</Text>
              <Text style={styles.emptySubtitle}>{searchTerm ? `No results for "${searchTerm}"` : 'No devotees in this category'}</Text>
            </View>
          ) : (
            <FlashList data={filteredDevotees} renderItem={renderItem} estimatedItemSize={72} keyExtractor={item => item.id} contentContainerStyle={styles.listContent}
              refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#FF8F00" colors={['#FF8F00']} />} />
          )}

          <FAB icon="done_all" label={pendingCount > 0 ? `Save (${pendingCount})` : 'Save'} onPress={handleSave} loading={saveMutation.isPending} visible={isDirty && !sessionLocked} badgeCount={pendingCount} pulse={pendingCount > 0} accessibilityLabel={`Save attendance, ${pendingCount} unsaved changes`} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF8E1'},
  controls: {paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, gap: 10},
  categories: {gap: 8},
  chipActive: {paddingHorizontal: 18, paddingVertical: 10, borderRadius: 50},
  chipActiveText: {color: '#FFFFFF', fontSize: 13, fontWeight: '700'},
  chipInactive: {paddingHorizontal: 18, paddingVertical: 10, borderRadius: 50, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E0E0'},
  chipInactiveText: {color: '#616161', fontSize: 13, fontWeight: '600'},
  statsRow: {flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 10},
  miniStat: {flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 10, alignItems: 'center', gap: 2, elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.06, shadowRadius: 4},
  miniStatVal: {fontSize: 20, fontWeight: '800'},
  miniStatLbl: {fontSize: 9, color: '#616161', fontWeight: '600'},
  searchRow: {paddingHorizontal: 16, marginBottom: 10},
  searchBox: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 50, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E0E0E0', gap: 8},
  searchInput: {flex: 1, color: '#212121', fontSize: 14, paddingVertical: 10},
  batchRow: {flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 10},
  batchBtn: {flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFFFFF', borderRadius: 50, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#E0E0E0'},
  batchText: {fontSize: 12, fontWeight: '700'},
  emptyState: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12},
  emptyIconWrap: {width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF3E0', justifyContent: 'center', alignItems: 'center'},
  emptyTitle: {color: '#212121', fontSize: 18, fontWeight: '700'},
  emptySubtitle: {color: '#616161', fontSize: 13, textAlign: 'center', lineHeight: 20},
  listContent: {paddingBottom: 120, paddingHorizontal: 16},
});
