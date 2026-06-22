import React, {useState} from 'react';
import {View, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Modal, Alert, StatusBar} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Avatar} from '@components/common/Avatar/Avatar';
import {OfflineBanner} from '@components/common/OfflineBanner/OfflineBanner';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {useAuth} from '@hooks/auth/useAuth';
import {useAttendanceAnalysis} from '@hooks/attendance/useAttendanceAnalysis';
import {useTeams} from '@hooks/devotees/useTeams';
import {useNavigation} from '@react-navigation/native';
import {signOut} from '@services/firebase/auth.service';
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

const StatCard = ({label, value, icon, color}: {label: string; value: string | number; icon: string; color: string}) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconWrap, {backgroundColor: color + '15'}]}>
      <Icon name={icon} size={22} color={color} />
    </View>
    <Text style={[styles.statValue, {color}]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function HomeScreen() {
  const {user} = useAuth();
  const navigation = useNavigation<any>();
  const {data: analysis, isLoading: analysisLoading} = useAttendanceAnalysis(0);
  const {data: teams = []} = useTeams();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dailyQuote = QUOTES[new Date().getDate() % QUOTES.length];

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Logout', style: 'destructive', onPress: async () => { setShowProfileMenu(false); await signOut(); }},
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8F00" barStyle="light-content" />
      <OfflineBanner />

      {/* Profile Menu */}
      <Modal visible={showProfileMenu} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowProfileMenu(false)}>
          <View style={styles.profileMenu}>
            <LinearGradient colors={['#FF8F00', '#D4AF37']} style={styles.profileMenuHeader}>
              <Avatar name={user?.displayName ?? 'D'} size="lg" />
              <View style={{marginLeft: SPACING.md, flex: 1}}>
                <Text variant="title-md" style={{color: '#fff', fontWeight: '700'}}>{user?.displayName ?? 'Devotee'}</Text>
                <Text variant="body-sm" style={{color: 'rgba(255,255,255,0.85)'}}>{user?.email ?? ''}</Text>
              </View>
            </LinearGradient>
            <View style={styles.menuBody}>
              <TouchableOpacity style={styles.menuItem}>
                <Icon name="camera-outline" size={22} color="#FF8F00" />
                <Text variant="body-md" style={{flex: 1, color: '#212121'}}>Change Photo</Text>
                <Icon name="chevron-right" size={20} color="#BDBDBD" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Icon name="lock-reset" size={22} color="#FF8F00" />
                <Text variant="body-md" style={{flex: 1, color: '#212121'}}>Change Password</Text>
                <Icon name="chevron-right" size={20} color="#BDBDBD" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Icon name="information-outline" size={22} color="#FF8F00" />
                <Text variant="body-md" style={{flex: 1, color: '#212121'}}>About App</Text>
                <Icon name="chevron-right" size={20} color="#BDBDBD" />
              </TouchableOpacity>
              <View style={styles.menuDivider} />
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <Icon name="logout" size={22} color="#D32F2F" />
                <Text variant="body-md" style={{color: '#D32F2F', flex: 1}}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <LinearGradient colors={['#FF8F00', '#D4AF37']} style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.hareKrishna}>Hare Krishna!</Text>
              <Text style={styles.greeting}>{greeting},</Text>
              <Text style={styles.userName}>{user?.displayName?.split(' ')[0] ?? 'Devotee'}</Text>
              <Text style={styles.dateText}>{formatDate(new Date())}</Text>
            </View>
            <TouchableOpacity onPress={() => setShowProfileMenu(true)} activeOpacity={0.7}>
              <View style={styles.avatarRing}>
                <Avatar name={user?.displayName ?? 'D'} size="lg" />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.quoteBox}>
            <Icon name="format-quote-open" size={18} color="rgba(255,255,255,0.6)" />
            <Text style={styles.quoteText}>{dailyQuote.text}</Text>
            <Text style={styles.quoteAuthor}>— {dailyQuote.author}</Text>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="chart-arc" size={20} color="#FF8F00" />
            <Text style={styles.sectionTitle}>This Week's Overview</Text>
          </View>
          {analysisLoading ? <ListSkeleton count={1} /> : (
            <View style={styles.statsGrid}>
              <StatCard label="Total Devotees" value={analysis?.totalDevotees ?? teams.length ?? 0} icon="account-group" color="#FF8F00" />
              <StatCard label="Present" value={analysis?.totalPresent ?? 0} icon="check-circle" color="#2E7D32" />
              <StatCard label="Attendance %" value={`${analysis?.avgPct ?? 0}%`} icon="chart-line" color="#6A1B9A" />
              <StatCard label="Total Teams" value={teams.length || 4} icon="flag" color="#D4AF37" />
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="lightning-bolt" size={20} color="#FF8F00" />
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.quickGrid}>
            <TouchableOpacity style={styles.quickBtn} activeOpacity={0.7} onPress={() => navigation.navigate('AttendanceTab')}>
              <LinearGradient colors={['#FF8F00', '#F57C00']} style={styles.quickIconWrap}>
                <Icon name="calendar-check" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.quickLabel}>Attendance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickBtn} activeOpacity={0.7} onPress={() => navigation.navigate('CallingTab')}>
              <LinearGradient colors={['#6A1B9A', '#4A148C']} style={styles.quickIconWrap}>
                <Icon name="phone" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.quickLabel}>Calling</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickBtn} activeOpacity={0.7} onPress={() => navigation.navigate('CareTab')}>
              <LinearGradient colors={['#D4AF37', '#B8860B']} style={styles.quickIconWrap}>
                <Icon name="heart" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.quickLabel}>Care</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickBtn} activeOpacity={0.7} onPress={() => navigation.navigate('ProfilesTab')}>
              <LinearGradient colors={['#2E7D32', '#1B5E20']} style={styles.quickIconWrap}>
                <Icon name="account-group" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.quickLabel}>Devotees</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF8E1'},
  content: {paddingBottom: 100},
  hero: {paddingHorizontal: 20, paddingTop: 40, paddingBottom: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28},
  heroTop: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'},
  hareKrishna: {fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: '600'},
  greeting: {fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 4},
  userName: {fontSize: 28, fontWeight: '800', color: '#FFFFFF'},
  dateText: {fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2},
  avatarRing: {borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)', borderRadius: 30, padding: 2},
  quoteBox: {marginTop: 16, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 14},
  quoteText: {fontSize: 13, color: '#FFFFFF', fontStyle: 'italic', lineHeight: 20, marginTop: 4},
  quoteAuthor: {fontSize: 11, color: 'rgba(255,255,255,0.7)', textAlign: 'right', marginTop: 6},
  section: {paddingHorizontal: 20, marginTop: 20},
  sectionHeader: {flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14},
  sectionTitle: {color: '#212121', fontSize: 17, fontWeight: '700'},
  statsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  statCard: {
    width: '47.5%', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, alignItems: 'center', gap: 4,
    elevation: 3, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.08, shadowRadius: 8,
  },
  statIconWrap: {width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 4},
  statValue: {fontSize: 28, fontWeight: '800'},
  statLabel: {fontSize: 11, color: '#616161', fontWeight: '600'},
  quickGrid: {flexDirection: 'row', gap: 10},
  quickBtn: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 16, alignItems: 'center', gap: 8,
    elevation: 3, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.08, shadowRadius: 8,
  },
  quickIconWrap: {width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center'},
  quickLabel: {color: '#212121', fontSize: 11, fontWeight: '700'},
  modalOverlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: 80, paddingRight: 20},
  profileMenu: {backgroundColor: '#FFFFFF', borderRadius: 20, width: 280, elevation: 16, overflow: 'hidden'},
  profileMenuHeader: {flexDirection: 'row', alignItems: 'center', padding: 16},
  menuBody: {padding: 6},
  menuDivider: {height: 1, backgroundColor: '#E0E0E0', marginVertical: 4},
  menuItem: {flexDirection: 'row', alignItems: 'center', padding: 14, gap: 14, borderRadius: 12},
});
