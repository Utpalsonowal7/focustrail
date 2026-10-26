import { View } from 'react-native';
import { Muted } from './Text';
import { colors } from '../theme/tokens';
export function WeekChart({
  days,
}: {
  days: { day: string; minutes: number }[];
}) {
  const max = Math.max(1, ...days.map((d) => d.minutes));
  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-end' }}>
      {days.map((d) => (
        <View
          key={d.day}
          style={{ flex: 1, alignItems: 'center', gap: 8 }}
          accessibilityLabel={`${d.day}: ${d.minutes} minutes`}
        >
          <Muted>{d.minutes}</Muted>
          <View
            style={{ height: 100, width: '100%', justifyContent: 'flex-end' }}
          >
            <View
              style={{
                height: Math.max(3, (100 * d.minutes) / max),
                backgroundColor: colors.purple,
                borderRadius: 6,
              }}
            />
          </View>
          <Muted>{d.day.slice(8)}</Muted>
        </View>
      ))}
    </View>
  );
}
