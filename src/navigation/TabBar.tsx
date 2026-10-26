import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../components/Text';
import { colors } from '../theme/tokens';
const tabs = [
  ['Today', 'pie-chart-outline'],
  ['Tasks', 'checkbox-outline'],
  ['Habits', 'flame-outline'],
  ['Focus', 'timer-outline'],
  ['Summary', 'bar-chart-outline'],
  ['Profile', 'person-circle-outline'],
] as const;
export function TabBar({
  active,
  onChange,
}: {
  active: string;
  onChange: (s: string) => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.card,
        borderTopWidth: 1,
        borderColor: colors.line,
        paddingVertical: 8,
      }}
    >
      {tabs.map(([label, icon]) => (
        <Pressable
          key={label}
          accessibilityRole="tab"
          accessibilityState={{ selected: active === label }}
          accessibilityLabel={label}
          onPress={() => onChange(label)}
          style={{
            flex: 1,
            alignItems: 'center',
            gap: 6,
            paddingVertical: 8,
            minHeight: 52,
          }}
        >
          <Ionicons
            name={icon}
            size={23}
            color={active === label ? colors.lavender : colors.muted}
          />
          <Text
            style={{
              fontSize: 10,
              lineHeight: 14,
              color: active === label ? colors.lavender : colors.muted,
            }}
          >
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
