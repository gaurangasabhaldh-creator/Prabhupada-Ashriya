import React, {useState} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Alert,
  StatusBar,
} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Avatar} from '@components/common/Avatar/Avatar';
import {OfflineBanner} from '@components/common/OfflineBanner/OfflineBanner';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {useAuth} from '@hooks/auth/useAuth';
import {useAttendanceAnalysis} from '@hooks/attendance/useAttendanceAnalysis';
import {useTeams} from '@hooks/devotees/useTeams';
import {useNavigation} from '@react-navigation/native';
import {signOut} from '@services/firebase/auth.service';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {formatDate} from '@utils/date.utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const QUOTES = [
  {text: 'Chant Hare Krishna and be happy.', author: 'Srila Prabhupada'},
  {text: 'Be enthusiastic in devotional service.', author: 'Srila Prabhupada'},
  {text: 'Krishna is the Supreme Personality of Godhead.', author: 'Srila Prabhupada'},
  {text: 'The spiritual master opens the eyes of the blind.', author: 'Srila Prabhupada'},
  {text: 'Service to devotees is the highest form of worship.', author: 'Srila Prabhupada'},
];

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const SAMPLE_MATRIX = [
  {
    team: 'IGF',
    weeks: [
      {date: '01 Jun', total: 125, present: 112, target: 120, pct: 93},
      {date: '08 Jun', total: 125, present: 108, target: 120, pct: 90},
      {date: '15 Jun', total: 128, present: 98, target: 120, pct: 82},
      {date: '22 Jun', total: 128, present: 118, target: 120, pct: 98},
    ],
    avgPct: 91,
  },
  {
    team: 'IYF',
    weeks: [
      {date: '01 Jun', total: 85, present: 72, target: 80, pct: 90},
      {date: '08 Jun', total: 85, present: 68, target: 80, pct: 85},
      {date: '15 Jun', total: 88, present: 60, target: 80, pct: 75},
      {date: '22 Jun', total: 88, present: 78, target: 80, pct: 98},
    ],
    avgPct: 87,
  },
  {
    team: 'ICF Mtg',
    weeks: [
      {date: '01 Jun', total: 65, present: 58, target: 60, pct: 97},
      {date: '08 Jun', total: 65, present: 52, target: 60, pct: 87},
      {date: '15 Jun', total: 67, present: 45, target: 60, pct: 75},
      {date: '22 Jun', total: 67, present: 62, target: 60, pct: 103},
    ],
    avgPct: 90,
  },
  {
    team: 'ICF Prg',
    weeks: [
      {date: '01 Jun', total: 45, present: 38, target: 42, pct: 90},
      {date: '08 Jun', total: 45, present: 30, target: 42, pct: 71},
      {date: '15 Jun', total: 48, present: 28, target: 42, pct: 67},
      {date: '22 Jun', total: 48, present: 42, target: 42, pct: 100},
    ],
    avgPct: 82,
  },
];

const getPctColor = (pct: number) => {
  if (pct >= 90) return '#4CAF50';
  if (pct >= 80) return '#D4AF37';
  if (pct >= 70) return '#FF8F00';
  return '#FF5252';
};

const StatCard = ({label, value, icon, gradient}: {label: string; value: string | number; icon: string; gradient: string[]}) => (
  <LinearGradient colors={gradient} style={styles.statCard} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
    <View style={styles.statCardIconBg}>
      <Icon name={icon} size={20} color="rgba(255,255,255,0.9)" />
    </View>
    <Text style={styles.statCardValue}>{value}</Text>
    <Text style={styles.statCardLabel}>{label}</Text>
  </LinearGradient>
);

const WeekBlock = ({week}: {week: {date: string; total: number; present: number; target: number; pct: number}}) => {
  const color = getPctColor(week.pct);
  return (
    <View style={styles.weekBlock}>
      <Text style={styles.weekDate}>{week.date}</Text>
      <View style={styles.weekStats}>
        <View style={styles.weekStatRow}>
          <Icon name="account-group" size={12} color="#B0A89A" />
          <Text style={styles.weekStatText}>{week.total}</Text>
        </View>
        <View style={styles.weekStatRow}>
          <Icon name="check-circle" size={12} color="#4CAF50" />
          <Text style={styles.weekStatText}>{week.present}</Text>
        </View>
        <View style={styles.weekStatRow}>
          <Icon name="target" size={12} color="#D4AF37" />
          <Text style={styles.weekStatText}>{week.target}</Text>
        </View>
      </View>
      <View style={[styles.pctBadge, {backgroundColor: color + '25'}]}>
        <Text style={[styles.pctText, {color}]}>{week.pct}%</Text>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const {user} = useAuth();
  const navigation = useNavigation<any>();
  const {data: analysis, isLoading: analysisLoading} = useAttendanceAnalysis(0);
  const {data: teams = []} = useTeams();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dailyQuote = QUOTES[new Date().getDate() % QUOTES.length];

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Logout', style: 'destructive', onPress: async () => { setShowProfileMenu(false); await signOut(); }},
    ]);
  };

  const sortedMatrix = [...SAMPLE_MATRIX].sort((a, b) => b.avgPct - a.avgPct);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1A1A2E" barStyle="light-content" />
      <OfflineBanner />

      {/* Profile Menu */}
      <Modal visible={showProfileMenu} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowProfileMenu(false)}>
          <View style={styles.profileMenu}>
            <LinearGradient colors={['#FF8F00', '#E65100']} style={styles.profileMenuHeader}>
              <Avatar name={user?.displayName ?? 'D'} size="lg" />
              <View style={{marginLeft: SPACING.md, flex: 1}}>
                <Text variant="title-md" style={{color: '#fff', fontWeight: '700'}}>{user?.displayName ?? 'Devotee'}</Text>
                <Text variant="body-sm" style={{color: 'rgba(255,255,255,0.8)'}}>{user?.email ?? ''}</Text>
              </View>
            </LinearGradient>
            <View style={styles.menuBody}>
              <TouchableOpacity style={styles.menuItem}>
                <Icon name="camera-outline" size={22} color="#FF8F00" />
                <Text variant="body-md" style={{flex: 1, color: '#F5F0E8'}}>Change Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Icon name="lock-reset" size={22} color="#FF8F00" />
                <Text variant="body-md" style={{flex: 1, color: '#F5F0E8'}}>Change Password</Text>
              </TouchableOpacity>
              <View style={styles.menuDivider} />
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <Icon name="logout" size={22} color="#FF5252" />
                <Text variant="body-md" style={{color: '#FF5252', flex: 1}}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Month Picker */}
      <Modal visible={showMonthPicker} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowMonthPicker(false)}>
          <View style={styles.monthPicker}>
            <Text style={styles.monthPickerTitle}>Select Month</Text>
            <View style={styles.monthGrid}>
              {MONTHS.map((m, i) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.monthChip, selectedMonth === i && styles.monthChipActive]}
                  onPress={() => { setSelectedMonth(i); setShowMonthPicker(false); }}>
                  <Text style={[styles.monthChipText, selectedMonth === i && styles.monthChipTextActive]}>{m.slice(0, 3)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <LinearGradient colors={['#FF8F00', '#E65100', '#BF360C']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.heroSection}>
          <View style={styles.heroTop}>
            <View style={styles.heroLeft}>
              <Text style={styles.hareKrishna}>Hare Krishna!</Text>
              <Text style={styles.greeting}>{greeting},</Text>
              <Text style={styles.userName}>{user?.displayName?.split(' ')[0] ?? 'Devotee'}</Text>
              <Text style={styles.dateText}>{formatDate(new Date())}</Text>
            </View>
            <TouchableOpacity onPress={() => setShowProfileMenu(true)} activeOpacity={0.7}>
              <View style={styles.avatarGlow}>
                <Avatar name={user?.displayName ?? 'D'} size="lg" />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.quoteBox}>
            <Icon name="format-quote-open" size={16} color="rgba(255,255,255,0.5)" />
            <Text style={styles.quoteText}>{dailyQuote.text}</Text>
            <Text style={styles.quoteAuthor}>- {dailyQuote.author}</Text>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.section}>
          {analysisLoading ? <ListSkeleton count={1} /> : (
            <View style={styles.statsGrid}>
              <StatCard label="Total Devotees" value={analysis?.totalDevotees ?? teams.length ?? 0} icon="account-group" gradient={['#FF8F00', '#F57C00']} />
              <StatCard label="Present" value={analysis?.totalPresent ?? 0} icon="check-circle" gradient={['#4CAF50', '#2E7D32']} />
              <StatCard label="Attendance %" value={`${analysis?.avgPct ?? 0}%`} icon="chart-line" gradient={['#6A1B9A', '#4A148C']} />
              <StatCard label="Total Teams" value={teams.length || 4} icon="flag" gradient={['#D4AF37', '#B8860B']} />
            </View>
          )}
        </View>

        {/* Month/Year Filter */}
        <View style={styles.filterSection}>
          <TouchableOpacity style={styles.filterChip} onPress={() => setShowMonthPicker(true)}>
            <Icon name="calendar-month" size={18} color="#D4AF37" />
            <Text style={styles.filterText}>{MONTHS[selectedMonth]}</Text>
            <Icon name="chevron-down" size={16} color="#B0A89A" />
          </TouchableOpacity>
          <View style={styles.filterChip}>
            <Icon name="calendar" size={18} color="#D4AF37" />
            <Text style={styles.filterText}>{selectedYear}</Text>
            <Icon name="chevron-down" size={16} color="#B0A89A" />
          </View>
        </View>

        {/* Attendance Performance Matrix */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="view-dashboard" size={20} color="#D4AF37" />
            <Text style={styles.sectionTitle}>Attendance Performance</Text>
          </View>

          {SAMPLE_MATRIX.map((row) => (
            <View key={row.team} style={styles.matrixRow}>
              <View style={styles.matrixTeamHeader}>
                <Icon name="account-group" size={16} color="#FF8F00" />
                <Text style={styles.matrixTeamName}>{row.team}</Text>
                <View style={[styles.avgBadge, {backgroundColor: getPctColor(row.avgPct) + '25'}]}>
                  <Text style={[styles.avgBadgeText, {color: getPctColor(row.avgPct)}]}>Avg: {row.avgPct}%</Text>
                </View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.matrixScroll}>
                {row.weeks.map((week, i) => (
                  <WeekBlock key={i} week={week} />
                ))}
              </ScrollView>
            </View>
          ))}
        </View>

        {/* Team Rankings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="trophy" size={20} color="#D4AF37" />
            <Text style={styles.sectionTitle}>Team Rankings</Text>
          </View>
          {sortedMatrix.slice(0, 3).map((team, index) => {
            const medals = ['🥇', '🥈', '🥉'];
            const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];
            return (
              <View key={team.team} style={[styles.rankCard, {borderLeftColor: colors[index]}]}>
                <Text style={styles.rankMedal}>{medals[index]}</Text>
                <View style={{flex: 1}}>
                  <Text style={styles.rankTeamName}>{team.team}</Text>
                  <Text style={styles.rankDetail}>Avg Achievement: {team.avgPct}%</Text>
                </View>
                <View style={[styles.rankPctBadge, {backgroundColor: getPctColor(team.avgPct) + '25'}]}>
                  <Text style={[styles.rankPctText, {color: getPctColor(team.avgPct)}]}>{team.avgPct}%</Text>
                </View>
              </View>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#1A1A2E'},
  content: {paddingBottom: 100},
  // Hero
  heroSection: {paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl + 10, paddingBottom: SPACING.xl, borderBottomLeftRadius: 28, borderBottomRightRadius: 28},
  heroTop: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'},
  heroLeft: {flex: 1},
  hareKrishna: {fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: '600'},
  greeting: {fontSize: 15, color: 'rgba(255,255,255,0.7)', marginTop: 4},
  userName: {fontSize: 28, fontWeight: '800', color: '#FFFFFF'},
  dateText: {fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2},
  avatarGlow: {borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 30, padding: 2},
  quoteBox: {marginTop: SPACING.md, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: BORDER_RADIUS.lg, padding: SPACING.md},
  quoteText: {fontSize: 13, color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', lineHeight: 20, marginTop: 2},
  quoteAuthor: {fontSize: 11, color: 'rgba(255,255,255,0.55)', textAlign: 'right', marginTop: 4},
  // Section
  section: {paddingHorizontal: SPACING.lg, marginTop: SPACING.lg},
  sectionHeader: {flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md},
  sectionTitle: {color: '#F5F0E8', fontSize: 16, fontWeight: '700'},
  // Stats
  statsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm},
  statCard: {width: '47.5%', borderRadius: 20, padding: SPACING.md, minHeight: 110, justifyContent: 'flex-end', elevation: 6, shadowColor: '#000', shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.25, shadowRadius: 8},
  statCardIconBg: {width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 8},
  statCardValue: {fontSize: 26, fontWeight: '800', color: '#FFFFFF'},
  statCardLabel: {fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '600', letterSpacing: 0.3, marginTop: 2},
  // Filter
  filterSection: {flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.lg, marginTop: SPACING.lg},
  filterChip: {flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#25253E', borderRadius: BORDER_RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderWidth: 1, borderColor: '#353555'},
  filterText: {color: '#F5F0E8', fontSize: 13, fontWeight: '600'},
  // Matrix
  matrixRow: {backgroundColor: '#25253E', borderRadius: 16, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: '#353555'},
  matrixTeamHeader: {flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm},
  matrixTeamName: {color: '#F5F0E8', fontSize: 15, fontWeight: '700', flex: 1},
  matrixScroll: {marginHorizontal: -4},
  avgBadge: {paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12},
  avgBadgeText: {fontSize: 12, fontWeight: '700'},
  weekBlock: {backgroundColor: '#1E1E35', borderRadius: 14, padding: SPACING.sm, marginHorizontal: 4, width: 100, alignItems: 'center', borderWidth: 1, borderColor: '#2D2D4A'},
  weekDate: {color: '#D4AF37', fontSize: 11, fontWeight: '700', marginBottom: 6},
  weekStats: {gap: 4, width: '100%', marginBottom: 6},
  weekStatRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  weekStatText: {color: '#F5F0E8', fontSize: 11},
  pctBadge: {paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginTop: 2},
  pctText: {fontSize: 13, fontWeight: '800'},
  // Rankings
  rankCard: {flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderRadius: 16, borderLeftWidth: 4, gap: SPACING.md, backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: SPACING.sm},
  rankMedal: {fontSize: 28},
  rankTeamName: {color: '#F5F0E8', fontSize: 15, fontWeight: '700'},
  rankDetail: {color: '#B0A89A', fontSize: 12, marginTop: 2},
  rankPctBadge: {paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12},
  rankPctText: {fontSize: 15, fontWeight: '800'},
  // Profile menu
  modalOverlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: 80, paddingRight: SPACING.lg},
  profileMenu: {backgroundColor: '#25253E', borderRadius: BORDER_RADIUS.lg, width: 280, elevation: 16, overflow: 'hidden'},
  profileMenuHeader: {flexDirection: 'row', alignItems: 'center', padding: SPACING.md},
  menuBody: {padding: SPACING.xs},
  menuDivider: {height: 1, backgroundColor: '#353555', marginVertical: SPACING.xs},
  menuItem: {flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.md, borderRadius: BORDER_RADIUS.sm},
  // Month picker
  monthPicker: {backgroundColor: '#25253E', borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, width: 300, alignSelf: 'center', marginTop: 200},
  monthPickerTitle: {color: '#F5F0E8', fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: SPACING.md},
  monthGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, justifyContent: 'center'},
  monthChip: {backgroundColor: '#1E1E35', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: '#353555'},
  monthChipActive: {backgroundColor: '#FF8F00', borderColor: '#FF8F00'},
  monthChipText: {color: '#B0A89A', fontSize: 13, fontWeight: '600'},
  monthChipTextActive: {color: '#FFFFFF'},
});
