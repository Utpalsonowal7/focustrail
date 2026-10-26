import type { ReactNode } from 'react';import { View } from 'react-native';import { colors } from '../theme/tokens';
export function Card({children}:{children:ReactNode}){return <View style={{backgroundColor:colors.card,borderRadius:16,padding:16,gap:12}}>{children}</View>;}
