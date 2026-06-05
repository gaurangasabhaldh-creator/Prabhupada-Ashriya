import {useAuthStore, selectUser, selectRole, selectTeamIds, selectOrgId, selectIsOffline} from '@store/auth.store';

export const useAuth = () => {
  const user = useAuthStore(selectUser);
  const role = useAuthStore(selectRole);
  const teamIds = useAuthStore(selectTeamIds);
  const organizationId = useAuthStore(selectOrgId);
  const isOffline = useAuthStore(selectIsOffline);
  const isLoading = useAuthStore(s => s.isLoading);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  return {user, role, teamIds, organizationId, isOffline, isLoading, isAuthenticated};
};
