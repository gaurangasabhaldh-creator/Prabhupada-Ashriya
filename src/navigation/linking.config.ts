import {LinkingOptions} from '@react-navigation/native';
import {RootStackParamList} from '@mytypes/navigation.types';

export const linkingConfig: LinkingOptions<RootStackParamList> = {
  prefixes: ['prabhupadashraya://'],
  config: {
    screens: {
      App: {
        screens: {
          MainTabs: {
            screens: {
              AttendanceTab: {
                screens: {
                  Attendance: 'attendance',
                  DevoteeAttendanceDetail: 'attendance/devotee/:devoteeId',
                },
              },
              CallingTab: {
                screens: {
                  Calling: 'calling',
                  CallDetail: 'calling/:listId/:callId',
                },
              },
              CareTab: {
                screens: {
                  Care: 'care',
                  FollowUpDetail: 'care/followup/:followUpId',
                },
              },
              ProfilesTab: {
                screens: {
                  DevoteeList: 'devotees',
                  DevoteeDetail: 'devotees/:devoteeId',
                },
              },
            },
          },
        },
      },
    },
  },
};
