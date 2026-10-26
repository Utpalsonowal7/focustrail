import React from 'react';import { Text as NativeText,type TextProps } from 'react-native';import { colors } from '../theme/tokens';
export function Text({style,...props}:TextProps){return <NativeText {...props} style={[{color:colors.text,fontSize:15,lineHeight:23},style]}/>;}
export function Muted(props:TextProps){return <Text {...props} style={[{color:colors.muted,fontSize:13},props.style]}/>;}
export function Heading(props:TextProps){return <Text {...props} style={[{fontSize:24,lineHeight:32,fontWeight:'600',letterSpacing:-.6},props.style]}/>;}
