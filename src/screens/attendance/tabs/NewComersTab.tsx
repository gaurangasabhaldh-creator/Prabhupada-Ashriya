import React, {useState} from 'react';
import {
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {Text} from '@components/common/Typography/Text';
import {Button} from '@components/common/Button/Button';
import {IconButton} from '@components/common/Button/IconButton';
import {TextInput} from '@components/common/Input/TextInput';
import {EmptyState} from '@components/common/EmptyState/EmptyState';
import {Avatar} from '@components/common/Avatar/Avatar';
import {useNewComers, useAddNewComer} from '@hooks/attendance/useNewComers';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {formatDate} from '@utils/date.utils';

const schema = z.object({
  fullName: z.string().min(2, 'Name required'),
  mobileNumber: z.string().min(10, 'Valid phone required'),
  invitedByName: z.string().optional(),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const AddVisitorSheet = ({onClose}: {onClose: () => void}) => {
  const addMutation = useAddNewComer();
  const {control, handleSubmit, formState: {errors}} = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await addMutation.mutateAsync(data);
    onClose();
  };

  return (
    <Modal visible transparent animationType="slide" statusBarTranslucent>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheetWrapper}>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text variant="title-lg">Add New Visitor</Text>
            <IconButton name="close" onPress={onClose} accessibilityLabel="Close" />
          </View>
          <View style={styles.sheetBody}>
            <Controller
              control={control}
              name="fullName"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput label="Full Name *" onChangeText={onChange} onBlur={onBlur} value={value ?? ''} error={errors.fullName?.message} autoCapitalize="words" />
              )}
            />
            <Controller
              control={control}
              name="mobileNumber"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput label="Mobile Number *" onChangeText={onChange} onBlur={onBlur} value={value ?? ''} error={errors.mobileNumber?.message} keyboardType="phone-pad" />
              )}
            />
            <Controller
              control={control}
              name="invitedByName"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput label="Invited By" onChangeText={onChange} onBlur={onBlur} value={value ?? ''} autoCapitalize="words" />
              )}
            />
            <Controller
              control={control}
              name="notes"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput label="Notes" onChangeText={onChange} onBlur={onBlur} value={value ?? ''} multiline numberOfLines={3} />
              )}
            />
            <Button
              label="Save Visitor"
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              size="lg"
              loading={addMutation.isPending}
              fullWidth
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default function NewComersTab() {
  const [showAdd, setShowAdd] = useState(false);
  const {data: newComers = [], isLoading} = useNewComers();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="body-md" color="onSurfaceVariant">
          {newComers.length} visitor{newComers.length !== 1 ? 's' : ''} this week
        </Text>
        <Button label="Add New Visitor" leftIcon="person_add" variant="primary" size="sm" onPress={() => setShowAdd(true)} />
      </View>

      {newComers.length === 0 ? (
        <EmptyState
          icon="person_add"
          title="No New Visitors"
          message="No new comers recorded this week."
          actionLabel="Add Visitor"
          onAction={() => setShowAdd(true)}
        />
      ) : (
        <FlatList
          data={newComers}
          keyExtractor={item => item.id}
          contentContainerStyle={{paddingBottom: 100}}
          renderItem={({item}) => (
            <View style={styles.row}>
              <Avatar name={item.fullName} size="md" />
              <View style={styles.rowInfo}>
                <Text variant="title-md">{item.fullName}</Text>
                <Text variant="body-sm" color="onSurfaceVariant">{item.mobileNumber}</Text>
                {item.invitedByName && (
                  <Text variant="body-sm" color="onSurfaceVariant">Invited by: {item.invitedByName}</Text>
                )}
                <Text variant="label-md" color="outline">
                  {formatDate(item.firstVisitDate.toDate())}
                </Text>
              </View>
            </View>
          )}
        />
      )}

      {showAdd && <AddVisitorSheet onClose={() => setShowAdd(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.marginMobile, paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.outlineVariant,
  },
  row: {
    flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md,
    paddingVertical: SPACING.md, paddingHorizontal: SPACING.marginMobile,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.outlineVariant,
  },
  rowInfo: {flex: 1, gap: 2},
  backdrop: {...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)'},
  sheetWrapper: {flex: 1, justifyContent: 'flex-end'},
  sheet: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl,
    paddingBottom: SPACING.xl + 16,
  },
  sheetHandle: {
    width: 36, height: 4, borderRadius: 2, backgroundColor: COLORS.outlineVariant,
    alignSelf: 'center', marginVertical: SPACING.sm,
  },
  sheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.marginMobile, marginBottom: SPACING.sm,
  },
  sheetBody: {gap: SPACING.md, paddingHorizontal: SPACING.marginMobile},
});
