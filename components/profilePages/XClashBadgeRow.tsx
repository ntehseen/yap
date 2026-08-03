import React from 'react';
import { xClashProfileTypes } from '@/util/atoms';

interface Props {
  xClash?: xClashProfileTypes;
}

function chip(label: string, value?: string) {
  if (!value) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
      <span className="text-foreground/70">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </span>
  );
}

/** Quiet metadata row for optional X-Clash fields. */
export default function XClashBadgeRow({ xClash }: Props) {
  if (!xClash) return null;

  const items = [
    chip('Server', xClash.server),
    chip('Alliance', xClash.alliance),
    chip('Castle', xClash.castleLevel),
    chip('CP', xClash.combatPower),
    chip('Role', xClash.role),
  ].filter(Boolean);

  if (!items.length) return null;

  return <div className="mt-3 flex flex-wrap gap-2">{items}</div>;
}
