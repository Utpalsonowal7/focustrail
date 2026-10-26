import { Card } from './Card';import { Text,Muted } from './Text';
export function Empty({title,detail}:{title:string;detail:string}){return <Card><Text style={{fontWeight:'600'}}>{title}</Text><Muted>{detail}</Muted></Card>;}
