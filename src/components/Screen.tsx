import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { Heading, Muted } from './Text';
export function Screen({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 32,
        gap: 20,
        width: '100%',
        maxWidth: 600,
        alignSelf: 'center',
      }}
    >
      <View style={{ gap: 4 }}>
        <Heading>{title}</Heading>
        {subtitle && <Muted>{subtitle}</Muted>}
      </View>
      {children}
    </ScrollView>
  );
}
