import React from 'react';
import { View } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { colors } from '../theme/tokens';
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          padding: 32,
          justifyContent: 'center',
          gap: 20,
        }}
      >
        <Text>
          FocusTrail could not open. Your saved data has not been cleared.
        </Text>
        <Button
          label="Try again"
          onPress={() => this.setState({ error: false })}
        />
      </View>
    ) : (
      this.props.children
    );
  }
}
