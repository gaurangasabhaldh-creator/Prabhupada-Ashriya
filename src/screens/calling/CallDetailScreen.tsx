import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Button} from '@components/common/Button/Button';
import {Icon} from '@components/common/Icon/Icon';
import {Avatar} from '@components/common/Avatar/Avatar';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {CallStatusBottomSheet} from '@components/calling/CallStatusBottomSheet';
import {useCallingRecords} from '@hooks/calling/useCallingRecords';
import {useUpdateCallStatus} from '@hooks/calling/useUpdateCallStatus';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {
  CALL_STATUS_LABELS,
  CALL_STATUS_COLORS,
  CALL_STATUS_ICONS,
  CallStatus,
} from '@constants/callStatus';
import {CallingScreenProps} from '@mytypes/navigation.types';
import {openDialer, openWhatsApp} from '@utils/phone.utils';

type Props = CallingScreenProps<'CallDetail'>;

export default function CallDetailScreen({route, navigation}: Props) {
  const {callId, listId} = route.params;
  const {data: records = [], isLoading} = useCallingRecords(listId);
  const [showSheet, setShowSheet] = useState(false);
  const {markCall} = useUpdateCallStatus();

  const record = records.find(r => r.id === callId);

  if (isLoading) return <ListSkeleton count={4} />;
  if (!record) return null;

  const status = record.status as CallStatus;
  const statusColor = CALL_STATUS_COLORS[status];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileSection}>
          <Avatar name={record.devoteeName} size="xl" />
          <Text variant="headline-sm">{record.devoteeName}</Text>
          <Text variant="body-md" color="onSurfaceVariant">{record.devoteeMobile}</Text>
        </View>

        <View style={[styles.statusCard, {borderColor: statusColor, backgroundColor: statusColor + '10'}]}>
          <Icon name={CALL_STATUS_ICONS[status]} size={24} color={statusColor} filled />
          <Text variant="title-lg" style={{color: statusColor}}>
            {CALL_STATUS_LABELS[status]}
          </Text>
        </View>

        {record.notes ? (
          <View style={styles.notesCard}>
            <Text variant="label-md" color="onSurfaceVariant">Notes</Text>
            <Text variant="body-md">{record.notes}</Text>
          </View>
        ) : null}

        <View style={styles.actions}>
          <Button
            label="Call"
            leftIcon="call"
            variant="primary"
            onPress={() => openDialer(record.devoteeMobile)}
            style={{flex: 1}}
          />
          <Button
            label="WhatsApp"
            leftIcon="chat"
            variant="secondary"
            onPress={() => openWhatsApp(record.devoteeMobile)}
            style={{flex: 1}}
          />
        </View>

        <Button
          label="Update Status"
          leftIcon="edit"
          variant="outline"
          size="lg"
          fullWidth
          onPress={() => setShowSheet(true)}
        />
      </ScrollView>

      {showSheet && (
        <CallStatusBottomSheet
          record={record}
          onSave={(s: CallStatus, notes: string | null) => {
            markCall(record.id, s, notes);
            navigation.goBack();
          }}
          onClose={() => setShowSheet(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  content: {padding: SPACING.marginMobile, gap: SPACING.md},
  profileSection: {alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.lg},
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
  },
  notesCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  actions: {flexDirection: 'row', gap: SPACING.md},
});
