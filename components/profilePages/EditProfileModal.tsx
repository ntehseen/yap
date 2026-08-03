import React from 'react';
import { notificationTypes, xClashProfileTypes } from '@/util/atoms';
import handleUpdateProfile from '@/util/handleUpdateProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ROLE_OPTIONS = [
  '',
  'Member',
  'R4',
  'R5',
  'Prime Minister',
  'Leader',
];

interface Props {
  profile: notificationTypes;
  onClose: () => void;
}

export default function EditProfileModal({ profile, onClose }: Props) {
  const [bio, setBio] = React.useState(profile.bio || '');
  const [xClash, setXClash] = React.useState<xClashProfileTypes>({
    server: profile.xClash?.server || '',
    alliance: profile.xClash?.alliance || '',
    castleLevel: profile.xClash?.castleLevel || '',
    combatPower: profile.xClash?.combatPower || '',
    role: profile.xClash?.role || '',
  });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  function updateField<K extends keyof xClashProfileTypes>(
    key: K,
    value: string
  ) {
    setXClash((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    if (!profile.username) return;
    setSaving(true);
    setError('');
    try {
      await handleUpdateProfile({
        username: profile.username,
        bio,
        xClash,
      });
      onClose();
    } catch {
      setError('Could not save profile. Try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl">
        <h2 className="text-lg font-semibold text-foreground">Edit profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Bio and optional X-Clash details. Nothing here is required.
        </p>

        <label className="mt-5 block text-sm font-medium text-foreground">
          Bio
          <Textarea
            className="mt-1.5"
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 160))}
            placeholder="Say something about yourself..."
            rows={3}
          />
          <span className="mt-1 block text-xs text-muted-foreground">
            {bio.length}/160
          </span>
        </label>

        <div className="mt-5 space-y-3">
          <p className="text-sm font-medium text-foreground">X-Clash</p>
          <Input
            placeholder="Server"
            value={xClash.server || ''}
            onChange={(e) => updateField('server', e.target.value)}
          />
          <Input
            placeholder="Alliance"
            value={xClash.alliance || ''}
            onChange={(e) => updateField('alliance', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Castle level"
              value={xClash.castleLevel || ''}
              onChange={(e) => updateField('castleLevel', e.target.value)}
            />
            <Input
              placeholder="Combat power"
              value={xClash.combatPower || ''}
              onChange={(e) => updateField('combatPower', e.target.value)}
            />
          </div>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
            value={xClash.role || ''}
            onChange={(e) => updateField('role', e.target.value)}
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role || 'none'} value={role}>
                {role || 'Role (optional)'}
              </option>
            ))}
          </select>
        </div>

        {error ? (
          <p className="mt-3 text-sm text-destructive">{error}</p>
        ) : null}

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="button" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}
