"use client";

import { useActionState } from "react";
import { updateSiteSettings, type SettingsFormState } from "@/lib/actions/settings";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/primitives";
import type { SiteSettings } from "@/lib/data";

const initialState: SettingsFormState = {};

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, pending] = useActionState(updateSiteSettings, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <p className="font-bold text-brand-900">Identity</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField label="Barangay name" name="barangayName" defaultValue={settings.barangayName} />
          <TextField label="Tagline" name="tagline" defaultValue={settings.tagline} />
        </div>
      </Card>

      <Card>
        <p className="font-bold text-brand-900">Contact</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField label="Address" name="address" defaultValue={settings.address ?? ""} />
          <TextField label="Telephone" name="telephone" defaultValue={settings.telephone ?? ""} />
          <TextField label="Mobile" name="mobile" defaultValue={settings.mobile ?? ""} />
          <TextField label="Email" name="email" defaultValue={settings.email ?? ""} />
          <TextField label="Office hours" name="officeHours" defaultValue={settings.officeHours ?? ""} />
        </div>
      </Card>

      <Card>
        <p className="font-bold text-brand-900">Social</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField
            label="Official Facebook URL"
            name="facebookUrl"
            defaultValue={settings.facebookUrl ?? ""}
          />
          <TextField
            label="Punong Barangay Facebook URL"
            name="captainFacebookUrl"
            defaultValue={settings.captainFacebookUrl ?? ""}
          />
        </div>
      </Card>

      <Card>
        <p className="font-bold text-brand-900">Statistics</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <TextField
            label="Population"
            name="population"
            type="number"
            defaultValue={settings.population?.toString() ?? ""}
          />
          <TextField
            label="Population year"
            name="populationYear"
            type="number"
            defaultValue={settings.populationYear?.toString() ?? ""}
          />
          <TextField
            label="Households"
            name="households"
            type="number"
            defaultValue={settings.households?.toString() ?? ""}
          />
        </div>
      </Card>

      <Card className="border-red-600/30">
        <p className="font-bold text-red-700">Emergency Banner</p>
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="emergencyBannerActive"
            defaultChecked={settings.emergencyBannerActive}
            className="h-4 w-4"
          />
          Show the site-wide emergency banner
        </label>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Level</label>
            <select
              name="emergencyBannerLevel"
              defaultValue={settings.emergencyBannerLevel ?? "info"}
              className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
            >
              <option value="info">Info</option>
              <option value="watch">Watch</option>
              <option value="warning">Warning</option>
              <option value="red_alert">Red Alert</option>
            </select>
          </div>
          <TextField
            label="Message"
            name="emergencyBannerMessage"
            defaultValue={settings.emergencyBannerMessage ?? ""}
          />
        </div>
      </Card>

      {state.error ? <p className="text-sm font-medium text-red-700">{state.error}</p> : null}
      {state.success ? (
        <p className="text-sm font-medium text-teal-700">Settings saved.</p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save Settings"}
      </Button>
    </form>
  );
}

function TextField({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
      />
    </div>
  );
}
