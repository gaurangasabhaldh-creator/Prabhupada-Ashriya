import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Button} from '@components/common/Button/Button';
import {Icon} from '@components/common/Icon/Icon';
import {Avatar} from '@components/common/Avatar/Avatar';
import {TextInput} from '@components/common/Input/TextInput';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {useFollowUp} from '@hooks/care/useFollowUps';
import {useUpdateFollowUpStatus, useAddFollowUpNote} from '@hooks/care/useFollowUpMutation';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {
  FOLLOW_UP_STATUS,
  FOLLOW_UP_STATUS_LABELS,
  PRIORITY_COLORS,
  Priority,
} from '@constants/callStatus';
import {CareScreenProps} from '@mytypes/navigation.types';
import {formatDate, formatDateTime} from '@utils/date.utils';
import {FollowUpDocument} from '@mytypes/followUp.types';

type Props = CareScreenProps<'FollowUpDetail'>;

const REASON_LABELS: Record<FollowUpDocument['reason'], string> = {
  consecutive_absence: 'Consecutive Absence',
  confirmed_not_attended: 'Confirmed Not Attending',
  inactive: 'Inactive',
  manual: 'Manual',
};

const STATUS_OPTIONS = Object.values(FOLLOW_UP_STATUS);

const DetailRow = ({label, value}: {label: string; value: string}) => (
  <View style={detailStyles.row}>
    <Text variant="label-md" color="onSurfaceVariant" style={{width: 100}}>{label}</Text>
    <Text variant="body-md" style={{flex: 1}}>{value}</Text>
  </View>
);

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
});

export default function FollowUpDetailScreen({route}: Props) {
  const {followUpId} = route.params;
  const {data: followUp, isLoading} = useFollowUp(followUpId);
  const updateStatus = useUpdateFollowUpStatus(followUpId);
  const addNote = useAddFollowUpNote(followUpId);
  const [noteText, setNoteText] = useState('');
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  if (isLoading) return <ListSkeleton count={5} />;
  if (!followUp) return null;

  const priorityColor = PRIORITY_COLORS[followUp.priority as Priority];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.profile}>
            <Avatar name={followUp.devoteeName} size="xl" />
            <Text variant="headline-sm">{followUp.devoteeName}</Text>
            <Text variant="body-md" color="onSurfaceVariant">{followUp.devoteeTeamName}</Text>
            <View style={[styles.priorityChip, {backgroundColor: priorityColor + '20', borderColor: priorityColor}]}>
              <Text variant="label-md" style={{color: priorityColor}}>
                {followUp.priority.toUpperCase()} PRIORITY
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <DetailRow label="Reason" value={REASON_LABELS[followUp.reason]} />
            <DetailRow label="Status" value={FOLLOW_UP_STATUS_LABELS[followUp.status]} />
            <DetailRow label="Attempts" value={String(followUp.contactAttempts)} />
            {followUp.lastContactDate ? (
              <DetailRow
                label="Last Contact"
                value={formatDate((followUp.lastContactDate as any).toDate())}
              />
            ) : null}
            <DetailRow
              label="Created"
              value={formatDate((followUp.createdAt as any).toDate?.() ?? new Date())}
            />
          </View>

          <Button
            label="Update Status"
            leftIcon="edit"
            variant="outline"
            fullWidth
            onPress={() => setShowStatusPicker(s => !s)}
          />

          {showStatusPicker && (
            <View style={styles.statusPicker}>
              {STATUS_OPTIONS.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.statusOption,
                    followUp.status === s && styles.statusOptionActive,
                  ]}
                  onPress={() => {
                    setShowStatusPicker(false);
                    updateStatus.mutate({
                      status: s,
                      noteText: `Status changed to ${FOLLOW_UP_STATUS_LABELS[s]}`,
                    });
                  }}>
                  <Text
                    variant="body-md"
                    style={{color: followUp.status === s ? COLORS.primary : COLORS.onSurface}}>
                    {FOLLOW_UP_STATUS_LABELS[s]}
                  </Text>
                  {followUp.status === s && <Icon name="check" size={18} color={COLORS.primary} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {followUp.notes.length > 0 && (
            <View style={styles.notesSection}>
              <Text variant="title-md" style={{marginBottom: SPACING.sm}}>Notes</Text>
              {[...followUp.notes].reverse().map((n, i) => (
                <View key={i} style={styles.noteItem}>
                  <View style={styles.noteDot} />
                  <View style={styles.noteContent}>
                    <Text variant="body-md">{n.note}</Text>
                    <Text variant="label-sm" color="onSurfaceVariant">
                      {n.addedByName} · {formatDateTime((n.addedAt as any).toDate?.() ?? new Date())}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <TextInput
            label="Add a note..."
            value={noteText}
            onChangeText={setNoteText}
            multiline
            numberOfLines={3}
          />
          <Button
            label="Add Note"
            leftIcon="add_comment"
            variant="primary"
            fullWidth
            loading={addNote.isPending}
            onPress={() => {
              if (!noteText.trim()) return;
              addNote.mutate(noteText.trim(), {onSuccess: () => setNoteText('')});
            }}
          />

          {followUp.isActive && (
            <Button
              label="Mark as Resolved"
              leftIcon="check_circle"
              variant="secondary"
              fullWidth
              loading={updateStatus.isPending}
              onPress={() =>
                updateStatus.mutate({
                  status: FOLLOW_UP_STATUS.RESOLVED,
                  noteText: 'Follow-up resolved.',
                })
              }
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  content: {padding: SPACING.marginMobile, gap: SPACING.md},
  profile: {alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.lg},
  priorityChip: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
  },
  card: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  statusPicker: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    overflow: 'hidden',
  },
  statusOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.marginMobile,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
  },
  statusOptionActive: {backgroundColor: COLORS.primaryContainer + '20'},
  notesSection: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  noteItem: {flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md},
  noteDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginTop: 6},
  noteContent: {flex: 1, gap: 2},
});
