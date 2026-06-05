import React, {Component, ReactNode} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {hasError: false, error: null};

  static getDerivedStateFromError(error: Error): State {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error) {
    console.error('[ErrorBoundary]', error);
  }

  reset = () => this.setState({hasError: false, error: null});

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <View style={styles.exclamation} />
          </View>
          <View style={styles.textBlock}>
            {/* Using RN Text directly to avoid circular dep on custom Text */}
            <View style={styles.titleRow} />
          </View>
          <TouchableOpacity style={styles.btn} onPress={this.reset}>
            <View />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

// ─── Lightweight wrapper that avoids importing custom components ───────────────
import {Text as RNText} from 'react-native';

export class ErrorBoundaryFull extends Component<Props, State> {
  state: State = {hasError: false, error: null};

  static getDerivedStateFromError(error: Error): State {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error) {
    console.error('[ErrorBoundary]', error);
  }

  reset = () => this.setState({hasError: false, error: null});

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <RNText style={styles.emoji}>⚠️</RNText>
          <RNText style={styles.title}>Something went wrong</RNText>
          <RNText style={styles.message}>
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </RNText>
          <TouchableOpacity style={styles.btn} onPress={this.reset}>
            <RNText style={styles.btnText}>Try Again</RNText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.md,
    width: '100%',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.errorContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exclamation: {
    width: 4,
    height: 20,
    backgroundColor: COLORS.secondary,
    borderRadius: 2,
  },
  textBlock: {gap: SPACING.xs, alignItems: 'center'},
  titleRow: {},
  emoji: {fontSize: 40},
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.onSurface,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  btn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  btnText: {color: COLORS.onPrimary, fontWeight: '700', fontSize: 16},
});
