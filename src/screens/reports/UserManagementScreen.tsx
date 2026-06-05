import React, {useState} from 'react';
import {
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Button} from '@components/common/Button/Button';
import {IconButton} from '@components/common/Button/IconButton';
import {Avatar} from '@components/common/Avatar/Avatar';
import {Icon} from '@components/common/Icon/Icon';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {EmptyState} from '@components/common/EmptyState/EmptyState';
import {useTeams} from '@hooks/devotees/useTeams';
import {useAuth} from '@hooks/auth/useAuth';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {getUsersByOrg, updateUserRole} from '@services/firestore/users.repository';
import {updateDocument} from '@services/firestore/base.repository';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {USER_ROLES, ROLE_LABELS, UserRole} from '@constants/roles';
import {UserDocument} from '@mytypes/user.types';

const USERS_COLLECTION = 'users';

export default function UserManagementScreen() {
  const {organizationId} = useAuth();
  const queryClient = useQueryClient();
  const {data: teams = []} = useTeams();
  const [editUser, setEditUser] = useState<UserDocument | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>(USER_ROLES.VOLUNTEER);
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);

  const {data: users = [], isLoading} = useQuery({
    queryKey: ['users', organizationId],
    queryFn: () => getUsersByOrg(organizationId!),
    enabled: !!organizationId,
    staleTime: 60_000,
  });

  const openEdit = (user: UserDocument) => {
    setEditUser(user);
    setSelectedRole(user.role);
    setSelectedTeamIds(user.teamIds ?? []);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!editUser) return;
      await updateUserRole(editUser.uid, selectedRole, selectedTeamIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['users', organizationId]});
      setEditUser(null);
    },
    onError: (err: Error) => Alert.alert('Error', err.message),
  });

  const toggleTeam = (teamId: string) => {
    setSelectedTeamIds(prev =>
      prev.includes(teamId) ? prev.filter(id => id !== teamId) : [...prev, teamId],
    );
  };

  const ROLES = Object.values(USER_ROLES) as UserRole[];

  if (isLoading) return <ListSkeleton count={6} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headline-sm" color="primary">Users</Text>
        <Text variant="body-sm" color="onSurfaceVariant">{users.length} members</Text>
      </View>

      {users.length === 0 ? (
        <EmptyState icon="manage_accounts" title="No Users" message="No users found in the organization." />
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item.uid}
          contentContainerStyle={{padding: SPACING.marginMobile, gap: SPACING.sm}}
          renderItem={({item}) => (
            <View style={styles.userCard}>
              <Avatar name={item.displayName} size="md" />
              <View style={styles.userInfo}>
                <Text variant="title-md">{item.displayName}</Text>
                <Text variant="body-sm" color="onSurfaceVariant">{item.email}</Text>
                <View style={styles.roleChip}>
                  <Text variant="label-sm" style={{color: COLORS.primary}}>
                    {ROLE_LABELS[item.role]}
                  </Text>
                </View>
              </View>
              <IconButton
                name="edit"
                onPress={() => openEdit(item)}
                accessibilityLabel="Edit user"
              />
            </View>
          )}
        />
      )}

      {/* Edit role modal */}
      <Modal visible={!!editUser} transparent animationType="slide" statusBarTranslucent>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setEditUser(null)}
        />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <Text variant="title-lg">Edit Role — {editUser?.displayName}</Text>
            <IconButton name="close" onPress={() => setEditUser(null)} accessibilityLabel="Close" />
          </View>

          <View style={styles.sheetBody}>
            <Text variant="label-md" color="onSurfaceVariant">Role</Text>
            {ROLES.map(role => (
              <TouchableOpacity
                key={role}
                style={[styles.roleOption, selectedRole === role && styles.roleOptionActive]}
                onPress={() => setSelectedRole(role)}>
                <Text
                  variant="body-md"
                  style={{color: selectedRole === role ? COLORS.primary : COLORS.onSurface}}>
                  {ROLE_LABELS[role]}
                </Text>
                {selectedRole === role && (
                  <Icon name="check" size={18} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}

            <Text variant="label-md" color="onSurfaceVariant" style={{marginTop: SPACING.sm}}>
              Assigned Teams
            </Text>
            <View style={styles.teamGrid}>
              {teams.map(t => {
                const selected = selectedTeamIds.includes(t.id);
                return (
                  <TouchableOpacity
                    key={t.id}
                    style={[styles.teamOption, selected && styles.teamOptionActive]}
                    onPress={() => toggleTeam(t.id)}>
                    <Text
                      variant="label-md"
                      style={{color: selected ? COLORS.primary : COLORS.onSurface}}>
                      {t.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Button
              label="Save Changes"
              variant="primary"
              size="lg"
              fullWidth
              loading={saveMutation.isPending}
              onPress={() => saveMutation.mutate()}
            />
          </View>
        </View>
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  userInfo: {flex: 1, gap: 4},
  roleChip: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryContainer + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingBottom: SPACING.xl + 16,
    maxHeight: '80%',
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
    gap: SPACING.sm,
  },
  roleOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
  },
  roleOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryContainer + '20',
  },
  teamGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs},
  teamOption: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
  },
  teamOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryContainer + '20',
  },
});
