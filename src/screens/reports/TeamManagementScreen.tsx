import React, {useState} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Button} from '@components/common/Button/Button';
import {IconButton} from '@components/common/Button/IconButton';
import {TextInput} from '@components/common/Input/TextInput';
import {Icon} from '@components/common/Icon/Icon';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {EmptyState} from '@components/common/EmptyState/EmptyState';
import {useTeams} from '@hooks/devotees/useTeams';
import {useAuth} from '@hooks/auth/useAuth';
import {useQueryClient, useMutation} from '@tanstack/react-query';
import {addDocument, updateDocument} from '@services/firestore/base.repository';
import {QUERY_KEYS} from '@hooks/queryKeys';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {ALL_CATEGORIES, CATEGORY_LABELS, DevoteeCategory} from '@constants/categories';
import {TeamDocument} from '@mytypes/team.types';
import {serverTimestamp} from '@services/firestore/base.repository';

const TEAMS_COLLECTION = 'teams';

export default function TeamManagementScreen() {
  const {organizationId} = useAuth();
  const queryClient = useQueryClient();
  const {data: teams = [], isLoading} = useTeams();
  const [showForm, setShowForm] = useState(false);
  const [editTeam, setEditTeam] = useState<TeamDocument | null>(null);

  const [name, setName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [category, setCategory] = useState<DevoteeCategory>(ALL_CATEGORIES[0]);

  const resetForm = () => {
    setName('');
    setLeaderName('');
    setCategory('shraddhavan');
    setEditTeam(null);
  };

  const openAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (team: TeamDocument) => {
    setEditTeam(team);
    setName(team.name);
    setLeaderName(team.leaderName);
    setCategory(team.category);
    setShowForm(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!name.trim()) throw new Error('Team name required');
      if (editTeam) {
        await updateDocument(TEAMS_COLLECTION, editTeam.id, {
          name: name.trim(),
          leaderName: leaderName.trim(),
          category,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDocument(TEAMS_COLLECTION, {
          name: name.trim(),
          organizationId,
          leaderId: '',
          leaderName: leaderName.trim(),
          category,
          color: null,
          totalMembers: 0,
          activeMembers: 0,
          inactiveMembers: 0,
          newComers: 0,
          weeklyTarget: 0,
          targetType: 'percentage',
          stats: {
            weeklyPresent: 0,
            weeklyTotal: 0,
            weeklyAttendancePct: 0,
            monthlyAttendancePct: 0,
            currentWeekRank: 0,
            currentMonthRank: 0,
            growthPctWeekOnWeek: 0,
            lastUpdated: serverTimestamp(),
          },
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.teams.list(organizationId ?? '')});
      setShowForm(false);
      resetForm();
    },
    onError: (err: Error) => Alert.alert('Error', err.message),
  });

  const deactivateMutation = useMutation({
    mutationFn: (teamId: string) =>
      updateDocument(TEAMS_COLLECTION, teamId, {isActive: false, updatedAt: serverTimestamp()}),
    onSuccess: () =>
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.teams.list(organizationId ?? '')}),
  });

  if (isLoading) return <ListSkeleton count={6} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headline-sm" color="primary">Teams</Text>
        <Button label="Add Team" leftIcon="add" variant="primary" size="sm" onPress={openAdd} />
      </View>

      {teams.length === 0 ? (
        <EmptyState
          icon="group"
          title="No Teams"
          message="Create your first seva team."
          actionLabel="Add Team"
          onAction={openAdd}
        />
      ) : (
        <FlatList
          data={teams}
          keyExtractor={item => item.id}
          contentContainerStyle={{padding: SPACING.marginMobile, gap: SPACING.sm}}
          renderItem={({item}) => (
            <View style={styles.teamCard}>
              <View style={styles.teamInfo}>
                <Text variant="title-lg">{item.name}</Text>
                <Text variant="body-sm" color="onSurfaceVariant">
                  {CATEGORY_LABELS[item.category]} · Leader: {item.leaderName || 'Unassigned'}
                </Text>
                <Text variant="label-sm" color="onSurfaceVariant">
                  {item.totalMembers} members · {item.activeMembers} active
                </Text>
              </View>
              <View style={styles.teamActions}>
                <IconButton
                  name="edit"
                  onPress={() => openEdit(item)}
                  accessibilityLabel="Edit team"
                />
                <IconButton
                  name="delete"
                  onPress={() =>
                    Alert.alert('Deactivate Team', `Deactivate "${item.name}"?`, [
                      {text: 'Cancel', style: 'cancel'},
                      {text: 'Deactivate', style: 'destructive', onPress: () => deactivateMutation.mutate(item.id)},
                    ])
                  }
                  accessibilityLabel="Deactivate team"
                />
              </View>
            </View>
          )}
        />
      )}

      {/* Add / Edit Modal */}
      <Modal visible={showForm} transparent animationType="slide" statusBarTranslucent>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setShowForm(false)}
        />
        <KeyboardAvoidingView
          style={styles.sheetWrapper}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <View style={styles.sheetHeader}>
              <Text variant="title-lg">{editTeam ? 'Edit Team' : 'Add Team'}</Text>
              <IconButton name="close" onPress={() => setShowForm(false)} accessibilityLabel="Close" />
            </View>

            <View style={styles.sheetBody}>
              <TextInput
                label="Team Name *"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              <TextInput
                label="Leader Name"
                value={leaderName}
                onChangeText={setLeaderName}
                autoCapitalize="words"
              />

              <Text variant="label-md" color="onSurfaceVariant">Category</Text>
              <View style={styles.categoryGrid}>
                {ALL_CATEGORIES.map(c => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.catOption, category === c && styles.catOptionActive]}
                    onPress={() => setCategory(c)}>
                    <Text
                      variant="label-md"
                      style={{color: category === c ? COLORS.primary : COLORS.onSurface}}>
                      {CATEGORY_LABELS[c]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Button
                label={editTeam ? 'Save Changes' : 'Create Team'}
                variant="primary"
                size="lg"
                fullWidth
                loading={saveMutation.isPending}
                onPress={() => saveMutation.mutate()}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.marginMobile,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  teamInfo: {flex: 1, gap: 4},
  teamActions: {flexDirection: 'row', gap: SPACING.xs},
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheetWrapper: {flex: 1, justifyContent: 'flex-end'},
  sheet: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingBottom: SPACING.xl + 16,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.outlineVariant,
    alignSelf: 'center',
    marginVertical: SPACING.sm,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.marginMobile,
    marginBottom: SPACING.sm,
  },
  sheetBody: {
    paddingHorizontal: SPACING.marginMobile,
    gap: SPACING.md,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  catOption: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
  },
  catOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryContainer + '20',
  },
});
