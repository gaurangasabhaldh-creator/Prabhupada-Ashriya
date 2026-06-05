import firestore from '@react-native-firebase/firestore';
import {TeamDocument} from '@mytypes/team.types';
import {getDocument, subscribeToQuery} from './base.repository';

const COLLECTION = 'teams';

export const getTeamById = (id: string): Promise<TeamDocument | null> =>
  getDocument<TeamDocument>(COLLECTION, id);

export const getTeamsByOrg = async (orgId: string): Promise<TeamDocument[]> => {
  const snap = await firestore()
    .collection(COLLECTION)
    .where('organizationId', '==', orgId)
    .where('isActive', '==', true)
    .orderBy('name', 'asc')
    .get();
  return snap.docs.map(d => ({id: d.id, ...d.data()})) as TeamDocument[];
};

export const subscribeToTeams = (
  orgId: string,
  onNext: (teams: TeamDocument[]) => void,
): (() => void) =>
  subscribeToQuery<TeamDocument>(
    COLLECTION,
    {
      where: [{field: 'organizationId', op: '==', value: orgId}, {field: 'isActive', op: '==', value: true}],
      orderBy: {field: 'name', direction: 'asc'},
    },
    onNext,
  );
