import { YapPostKind } from './atoms';

export const YAP_TYPE_OPTIONS: {
  id: YapPostKind;
  label: string;
  short: string;
  placeholder: string;
}[] = [
  {
    id: 'yap',
    label: 'Yap',
    short: 'Yap',
    placeholder: "What's new?",
  },
  {
    id: 'recruitment',
    label: 'Recruitment',
    short: 'Recruit',
    placeholder: 'Looking for members…',
  },
  {
    id: 'battleReport',
    label: 'Battle report',
    short: 'Battle',
    placeholder: 'Share the battle report…',
  },
  {
    id: 'heroBuild',
    label: 'Hero build',
    short: 'Build',
    placeholder: 'Share a hero build…',
  },
];

export function yapTypeLabel(kind?: YapPostKind): string {
  if (!kind || kind === 'yap') return '';
  return YAP_TYPE_OPTIONS.find((o) => o.id === kind)?.label || '';
}

export function yapTypeShort(kind?: YapPostKind): string {
  if (!kind || kind === 'yap') return '';
  return YAP_TYPE_OPTIONS.find((o) => o.id === kind)?.short || '';
}

export function yapTypePlaceholder(kind?: YapPostKind): string {
  return (
    YAP_TYPE_OPTIONS.find((o) => o.id === kind)?.placeholder || "What's new?"
  );
}

export function normalizeTags(tags?: string[]): string[] {
  if (!tags?.length) return [];
  return tags
    .map((t) => t.trim().slice(0, 24))
    .filter(Boolean)
    .slice(0, 5);
}
