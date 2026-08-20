import { getSiteSettings } from "@/lib/data";
import { SettingsForm } from "./SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-900">Site Settings</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Everything here is editable — nothing on the public site is hard-coded.
      </p>

      <div className="mt-6">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
