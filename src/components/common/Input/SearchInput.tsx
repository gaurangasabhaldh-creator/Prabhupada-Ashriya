import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import {Icon} from '../Icon/Icon';
import {COLORS} from '@constants/colors';
import {BORDER_RADIUS, SPACING} from '@constants/spacing';
import {useDebounce} from '@hooks/shared/useDebounce';

interface Props {
  placeholder?: string;
  onChangeText: (text: string) => void;
  debounceMs?: number;
  autoFocus?: boolean;
}

export const SearchInput: React.FC<Props> = ({
  placeholder = 'Search...',
  onChangeText,
  debounceMs = 300,
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceMs);

  React.useEffect(() => {
    onChangeText(debouncedQuery);
  }, [debouncedQuery, onChangeText]);

  const handleClear = () => {
    setQuery('');
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      <Icon name="search" size={20} color="outline" style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder={placeholder}
        placeholderTextColor={COLORS.outline}
        selectionColor={COLORS.primary}
        autoFocus={autoFocus}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel={placeholder}
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={handleClear} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="cancel" size={18} color="outline" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    gap: SPACING.sm,
  },
  searchIcon: {flexShrink: 0},
  input: {
    flex: 1,
    fontFamily: 'WorkSans',
    fontSize: 14,
    color: COLORS.onSurface,
    padding: 0,
    minHeight: 20,
  },
});
