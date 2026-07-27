import { useState, useEffect, FormEvent } from "react";
import { createRoot } from "react-dom/client";

type Profile = {
  email: string;
  name: string;
  phone: string;
  address: string;
  preferredContact: "email" | "phone" | "text";
  notes: string;
};

type PendingLink = {
  email: string;
  sentAt: number;
};

const STORAGE_KEY = "tibly-account-profile";
const PENDING_KEY = "tibly-account-pending";

function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Profile;
  } catch {
    return null;
  }
}

function loadPending(): PendingLink | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingLink;
  } catch {
    return null;
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function SignedOutWelcome({
  onLinkSent,
}: {
  onLinkSent: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus("error");
      setErrorMsg("That doesn't look like a full email address. Mind checking it?");
      return;
    }
    setStatus("sending");
    window.setTimeout(() => {
      onLinkSent(email);
    }, 900);
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="card p-8">
        <h1 className="font-display text-2xl text-ink mb-2">My Account</h1>
        <p className="text-ink/70 mb-4">
          An account here just keeps your contact details and service notes on hand,
          so you're not retyping your address every time you reach out for a repair
          or a quote. No password to remember. We email you a one-time link and you're in.
        </p>
        <ul className="text-ink/70 mb-6 list-disc list-inside space-y-1">
          <li>Your name, phone, and address saved for next time</li>
          <li>A place to jot notes about your home for our crew</li>
          <li>Your preferred way to be contacted</li>
        </ul>

        {status === "sending" ? (
          <div className="rounded-lg border border-ink/10 bg-ink/[0.03] p-4 text-ink/70">
            Sending your sign-in link to <span className="font-medium">{email}</span>...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block">
              <span className="text-sm font-medium text-ink">Email address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </label>
            {status === "error" && (
              <p className="text-sm text-red-600">{errorMsg}</p>
            )}
            <button type="submit" className="btn w-full">
              Email me a sign-in link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function ConfirmLink({
  email,
  onConfirmed,
  onCancel,
}: {
  email: string;
  onConfirmed: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="max-w-xl mx-auto">
      <div className="card p-8 text-center">
        <h1 className="font-display text-2xl text-ink mb-2">Check your email</h1>
        <p className="text-ink/70 mb-6">
          We sent a sign-in link to <span className="font-medium">{email}</span>.
          Open it on this device to finish signing in.
        </p>
        <div className="rounded-lg border border-dashed border-ink/20 p-4 mb-6">
          <p className="text-sm text-ink/60 mb-3">
            Standing in for that email link right here, since this is a preview page:
          </p>
          <button onClick={onConfirmed} className="btn">
            Continue to my account
          </button>
        </div>
        <button onClick={onCancel} className="text-sm text-ink/60 underline">
          Use a different email
        </button>
      </div>
    </div>
  );
}

function AccountDashboard({
  profile,
  onSave,
  onSignOut,
}: {
  profile: Profile;
  onSave: (p: Profile) => void;
  onSignOut: () => void;
}) {
  const [form, setForm] = useState<Profile>(profile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave(form);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  const hasHistoryNotes = form.notes.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-2xl text-ink">Welcome back</h1>
            <p className="text-ink/60 text-sm">{profile.email}</p>
          </div>
          <button onClick={onSignOut} className="btn-secondary">
            Sign out
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-ink">Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jamie Carter"
                className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Phone</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(555) 010-2200"
                className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-ink">Home address</span>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="118 Maple Ave, Riverdale"
              className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-ink">Preferred contact method</span>
            <select
              value={form.preferredContact}
              onChange={(e) =>
                setForm({
                  ...form,
                  preferredContact: e.target.value as Profile["preferredContact"],
                })
              }
              className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-600"
            >
              <option value="email">Email</option>
              <option value="phone">Phone call</option>
              <option value="text">Text message</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-ink">Notes for our crew</span>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Gate code, dog in the yard, that squeaky back door we looked at last spring..."
              rows={4}
              className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
          </label>

          <div className="flex items-center gap-3">
            <button type="submit" className="btn">
              Save my details
            </button>
            {saved && (
              <span className="text-sm text-brand-600">Saved on this device.</span>
            )}
          </div>
        </form>
      </div>

      <div className="card p-8">
        <h2 className="font-display text-lg text-ink mb-2">Service notes</h2>
        {hasHistoryNotes ? (
          <p className="text-ink/70">{form.notes}</p>
        ) : (
          <p className="text-ink/60">
            Nothing here yet. Add a note above about your home, like where the water
            shutoff is or which room needs attention next, and it'll show here for
            your next visit.
          </p>
        )}
        <p className="text-xs text-ink/40 mt-4">
          This is saved right in your browser on this device only. It's not stored on
          a server anywhere, so it won't follow you to a new phone or computer.
        </p>
      </div>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pending, setPending] = useState<PendingLink | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    try {
      const p = loadProfile();
      const pend = loadPending();
      setProfile(p);
      setPending(pend);
    } catch {
      setLoadError(true);
    } finally {
      window.setTimeout(() => setLoading(false), 300);
    }
  }, []);

  function handleLinkSent(email: string) {
    const p: PendingLink = { email, sentAt: Date.now() };
    localStorage.setItem(PENDING_KEY, JSON.stringify(p));
    setPending(p);
  }

  function handleConfirmed() {
    if (!pending) return;
    const existing = loadProfile();
    const newProfile: Profile = existing ?? {
      email: pending.email,
      name: "",
      phone: "",
      address: "",
      preferredContact: "email",
      notes: "",
    };
    newProfile.email = pending.email;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    localStorage.removeItem(PENDING_KEY);
    setProfile(newProfile);
    setPending(null);
  }

  function handleCancelPending() {
    localStorage.removeItem(PENDING_KEY);
    setPending(null);
  }

  function handleSave(p: Profile) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    setProfile(p);
  }

  function handleSignOut() {
    localStorage.removeItem(PENDING_KEY);
    setPending(null);
    setProfile(null);
  }

  return (
    <div className="min-h-screen bg-ink/[0.02] py-12 px-4">
      {loading ? (
        <div className="max-w-xl mx-auto card p-8 text-center text-ink/60">
          Loading your account...
        </div>
      ) : loadError ? (
        <div className="max-w-xl mx-auto card p-8 text-center">
          <p className="text-ink/70 mb-4">
            Something went sideways loading your saved details. Try refreshing the page.
          </p>
          <button onClick={() => window.location.reload()} className="btn-secondary">
            Refresh
          </button>
        </div>
      ) : profile ? (
        <AccountDashboard
          profile={profile}
          onSave={handleSave}
          onSignOut={handleSignOut}
        />
      ) : pending ? (
        <ConfirmLink
          email={pending.email}
          onConfirmed={handleConfirmed}
          onCancel={handleCancelPending}
        />
      ) : (
        <SignedOutWelcome onLinkSent={handleLinkSent} />
      )}
    </div>
  );
}

createRoot(document.getElementById("tibly-app-root")!).render(<App />);