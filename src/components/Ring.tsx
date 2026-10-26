import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Text, Muted } from './Text';
import { colors } from '../theme/tokens';
export function Ring({
  value,
  label,
  progress,
  caption,
}: {
  value: string;
  label: string;
  progress: number;
  caption: string;
}) {
  const size = 280,
    r = 122,
    c = 2 * Math.PI * r;
  return (
    <View
      style={{
        alignSelf: 'center',
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 24,
      }}
      accessibilityLabel={`${label}: ${value}. ${caption}`}
    >
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle
          cx="140"
          cy="140"
          r={r}
          stroke="#303043"
          strokeWidth="30"
          fill="none"
        />
        <Circle
          cx="140"
          cy="140"
          r={r}
          stroke={colors.purple}
          strokeWidth="30"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - Math.max(0, Math.min(1, progress)))}
          rotation="-90"
          origin="140,140"
        />
      </Svg>
      <Muted>{label}</Muted>
      <Text
        style={{
          fontSize: 58,
          lineHeight: 76,
          fontWeight: '500',
          letterSpacing: -2,
          fontVariant: ['tabular-nums'],
        }}
      >
        {value}
      </Text>
      <Muted>{caption}</Muted>
    </View>
  );
}
