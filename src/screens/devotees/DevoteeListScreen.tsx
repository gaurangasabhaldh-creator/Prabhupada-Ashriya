import React, {useCallback, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {Text} from '@components/common/Typography/Text';
import {SearchInput} from '@components/common/Input/SearchInput';
import {Chip} from '@components/common/Chip/Chip';
import {IconButton} from '@components/common/Button/IconButton';
import {EmptyState} from '@components/common/EmptyState/EmptyState';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {OfflineBanner} from '@components/common/OfflineBanner/OfflineBanner';
import {DevoteeListItem} from '@components/devotees/DevoteeListItem';
import {useDevotees} from '@hooks/devotees/useDevotees';
import {useDevoteeSearch} from '@hooks/devotees/useDevoteeSearch';
import {usePermissions} from '@hooks/auth/usePermissions';
import {DevoteeDocument} from '@mytypes/devotee.types';
import {ProfilesScreenProps} from '@mytypes/navigation.types';
import {PROFILES_ROUTES} from '@constants/routes';
import {ALL_CATEGORIES, CATEGORY_LABELS} from '@constants/categories';
import {DEVOTEE_STATUS, DEVOTEE_STATUS_LABELS} from '@constants/attendance';
import {COLORS} from '@constants/colors';
import {SPACING} from '@constants/spacing';

type Props = ProfilesScreenProps<'DevoteeList'>;

const STATUS_FILTERS = [
  {value: '', label: 'All'},
  {value: DEVOTEE_STATUS.ACTIVE, label: DEVOTEE_STATUS_LABELS.active},
  {value: DEVOTEE_STATUS.INACTIVE, label: DEVOTEE_STATUS_LABELS.inactive},
  {value: DEVOTEE_STATUS.NEW, label: DEVOTEE_STATUS_LABELS.new},
];

export default function DevoteeListScreen({navigation}: Props) {
  const {canAddDevotee} = usePermissions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const isSearching = searchTerm.length >= 2;

  const {
    data: pages,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
    isRefetching,
  } = useDevotees({status: selectedStatus || undefined, category: selectedCategory || undefined});

  const {data: searchResults, isFetching: isSearchFetching} = useDevoteeSearch(searchTerm);

  const allDevotees: DevoteeDocument[] = isSearching
    ? (searchResults ?? [])
    : (pages?.pages.flatMap(p => p.data) ?? []);

  const handlePress = useCallback(
    (id: string) => navigation.navigate(PROFILES_ROUTES.DEVOTEE_DETAIL, {devoteeId: id}),
    [navigation],
  );

  const renderItem = useCallback(
    ({item}: {item: DevoteeDocument}) => (
      <DevoteeListItem devotee={item} onPress={handlePress} />
    ),
    [handlePress],
  );

  const loading = isLoading || (isSearching && isSearchFetching);

  return (
    <SafeAreaView style={styles.container}>
      <OfflineBanner />

      {/* Header */}
      <View style={styles.header}>
        <Text variant="headline-sm" color="secondary">
          Devotees {!loading && allDevotees.length > 0 ? `(${allDevotees.length}${hasNextPage ? '+' : ''})` : ''}
        </Text>
        {canAddDevotee && (
          <IconButton
            name="person_add"
            onPress={() => navigation.navigate(PROFILES_ROUTES.ADD_DEVOTEE)}
            accessibilityLabel="Add devotee"
            color="primary"
            size={24}
          />
        )}
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <SearchInput placeholder="Search by name or phone..." onChangeText={setSearchTerm} />
      </View>

      {/* Filters — hidden during search */}
      {!isSearching && (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}>
            {STATUS_FILTERS.map(f => (
              <Chip
                key={f.value}
                label={f.label}
                selected={selectedStatus === f.value}
                onPress={() => setSelectedStatus(f.value)}
              />
            ))}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}>
            <Chip
              label="All Categories"
              selected={selectedCategory === ''}
              onPress={() => setSelectedCategory('')}
            />
            {ALL_CATEGORIES.map(cat => (
              <Chip
                key={cat}
                label={CATEGORY_LABELS[cat]}
                selected={selectedCategory === cat}
                onPress={() => setSelectedCategory(cat)}
              />
            ))}
          </ScrollView>
        </>
      )}

      {/* List */}
      {loading ? (
        <ListSkeleton count={8} />
      ) : allDevotees.length === 0 ? (
        <EmptyState
          icon="group"
          title={isSearching ? 'No results found' : 'No devotees yet'}
          message={isSearching ? `No devotees match "${searchTerm}"` : 'Add your first devotee to get started.'}
          actionLabel={canAddDevotee && !isSearching ? 'Add Devotee' : undefined}
          onAction={() => navigation.navigate(PROFILES_ROUTES.ADD_DEVOTEE)}
        />
      ) : (
        <FlashList
          data={allDevotees}
          renderItem={renderItem}
          estimatedItemSize={72}
          keyExtractor={item => item.id}
          onEndReached={!isSearching && hasNextPage ? fetchNextPage : undefined}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          ListFooterComponent={
            isFetchingNextPage ? <ListSkeleton count={3} /> : null
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.marginMobile,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  searchRow: {paddingHorizontal: SPACING.marginMobile, marginBottom: SPACING.sm},
  filterRow: {
    paddingHorizontal: SPACING.marginMobile,
    paddingBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  listContent: {paddingBottom: 100},
});
