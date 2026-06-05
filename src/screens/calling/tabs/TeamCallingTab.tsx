import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {Text} from '@components/common/Typography/Text';
import {Button} from '@components/common/Button/Button';
import {FAB} from '@components/common/Button/FAB';
import {EmptyState} from '@components/common/EmptyState/EmptyState';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {SearchInput} from '@components/common/Input/SearchInput';
import {CallingDevoteeCard} from '@components/calling/CallingDevoteeCard';
import {CallingProgressHeader} from '@components/calling/CallingProgressHeader';
import {SubmissionStatusBadge} from '@components/calling/SubmissionStatusBadge';
import {CallStatusBottomSheet} from '@components/calling/CallStatusBottomSheet';
import {SessionLockBanner} from '@components/attendance/SessionLockBanner';
import {useCallingList} from '@hooks/calling/useCallingList';
import {useCallingRecords} from '@hooks/calling/useCallingRecords';
import {useUpdateCallStatus, useSaveCallingUpdates} from '@hooks/calling/useUpdateCallStatus';
import {useSubmitCallingReport} from '@hooks/calling/useSubmitCallingReport';
import {useCallingStore} from '@store/calling.store';
import {useUIStore} from '@store/ui.store';
import {COLORS} from '@constants/colors';
import {SPACING} from '@constants/spacing';
import {CallRecordDocument} from '@mytypes/calling.types';
import {CallStatus} from '@constants/callStatus';

interface Props {
  listId: string;
}

export default function TeamCallingTab({listId}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRecord, setActiveRecord] = useState<CallRecordDocument | null>(null);

  const {data: list, isLoading: listLoading} = useCallingList(listId);
  const {data: records = [], isLoading: recordsLoading, stats} = useCallingRecords(listId);
  const {markCall} = useUpdateCallStatus();
  const saveMutation = useSaveCallingUpdates(listId);
  const submitMutation = useSubmitCallingReport(listId);
  const pendingCount = Object.keys(useCallingStore(s => s.pendingUpdates)).length;
  const showConfirm = useUIStore(s => s.showConfirm);

  const filtered = records.filter(r =>
    !searchTerm ||
    r.devoteeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.devoteeMobile.includes(searchTerm),
  );

  const handleSubmit = () => {
    showConfirm({
      title: 'Submit Calling Report',
      message: `You have called ${stats.called} of ${stats.total} devotees. Submit the report for this week?`,
      confirmLabel: 'Submit',
      onConfirm: () => submitMutation.mutate(),
    });
  };

  if (listLoading || recordsLoading) return <ListSkeleton count={8} />;

  if (!list) {
    return (
      <EmptyState
        icon="phone_disabled"
        title="No Calling List"
        message="No calling list assigned for this week."
      />
    );
  }

  return (
    <View style={styles.container}>
      {list.isSubmitted && (
        <SessionLockBanner message="This week's calling report has been submitted." />
      )}

      <CallingProgressHeader list={list} pendingCount={pendingCount} />

      <View style={styles.searchRow}>
        <SearchInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search devotees..."
          style={{flex: 1}}
        />
        <SubmissionStatusBadge list={list} />
      </View>

      <FlashList
        data={filtered}
        keyExtractor={item => item.id}
        estimatedItemSize={80}
        renderItem={({item}) => (
          <CallingDevoteeCard
            record={item}
            onStatusPress={() => setActiveRecord(item)}
          />
        )}
        ListEmptyComponent={
          <EmptyState icon="phone" title="No records" message="No devotees match your search." />
        }
        contentContainerStyle={{paddingBottom: 120}}
      />

      {!list.isSubmitted && (
        <>
          <FAB
            icon="save"
            label={pendingCount > 0 ? `Save (${pendingCount})` : 'Save'}
            onPress={() => saveMutation.mutate()}
            loading={saveMutation.isPending}
            badgeCount={pendingCount}
          />

          {stats.pending === 0 && (
            <View style={styles.submitBar}>
              <Button
                label="Submit Report"
                variant="primary"
                size="lg"
                fullWidth
                onPress={handleSubmit}
                loading={submitMutation.isPending}
              />
            </View>
          )}
        </>
      )}

      {activeRecord && (
        <CallStatusBottomSheet
          record={activeRecord}
          onSave={(status: CallStatus, notes: string | null) =>
            markCall(activeRecord.id, status, notes)
          }
          onClose={() => setActiveRecord(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.marginMobile,
    paddingVertical: SPACING.sm,
  },
  submitBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.marginMobile,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: COLORS.outlineVariant,
  },
});
