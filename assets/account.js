import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
const STORAGE_KEY = "tibly-account-profile";
const PENDING_KEY = "tibly-account-pending";
function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function loadPending() {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function SignedOutWelcome({
  onLinkSent
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  function handleSubmit(e) {
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
  return /* @__PURE__ */ jsx("div", { className: "max-w-xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "card p-8", children: [
    /* @__PURE__ */ jsx("h1", { className: "font-display text-2xl text-ink mb-2", children: "My Account" }),
    /* @__PURE__ */ jsx("p", { className: "text-ink/70 mb-4", children: "An account here just keeps your contact details and service notes on hand, so you're not retyping your address every time you reach out for a repair or a quote. No password to remember. We email you a one-time link and you're in." }),
    /* @__PURE__ */ jsxs("ul", { className: "text-ink/70 mb-6 list-disc list-inside space-y-1", children: [
      /* @__PURE__ */ jsx("li", { children: "Your name, phone, and address saved for next time" }),
      /* @__PURE__ */ jsx("li", { children: "A place to jot notes about your home for our crew" }),
      /* @__PURE__ */ jsx("li", { children: "Your preferred way to be contacted" })
    ] }),
    status === "sending" ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-ink/10 bg-ink/[0.03] p-4 text-ink/70", children: [
      "Sending your sign-in link to ",
      /* @__PURE__ */ jsx("span", { className: "font-medium", children: email }),
      "..."
    ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-ink", children: "Email address" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            value: email,
            onChange: (e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            },
            placeholder: "you@example.com",
            className: "mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-600"
          }
        )
      ] }),
      status === "error" && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errorMsg }),
      /* @__PURE__ */ jsx("button", { type: "submit", className: "btn w-full", children: "Email me a sign-in link" })
    ] })
  ] }) });
}
function ConfirmLink({
  email,
  onConfirmed,
  onCancel
}) {
  return /* @__PURE__ */ jsx("div", { className: "max-w-xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "card p-8 text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "font-display text-2xl text-ink mb-2", children: "Check your email" }),
    /* @__PURE__ */ jsxs("p", { className: "text-ink/70 mb-6", children: [
      "We sent a sign-in link to ",
      /* @__PURE__ */ jsx("span", { className: "font-medium", children: email }),
      ". Open it on this device to finish signing in."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-dashed border-ink/20 p-4 mb-6", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-ink/60 mb-3", children: "Standing in for that email link right here, since this is a preview page:" }),
      /* @__PURE__ */ jsx("button", { onClick: onConfirmed, className: "btn", children: "Continue to my account" })
    ] }),
    /* @__PURE__ */ jsx("button", { onClick: onCancel, className: "text-sm text-ink/60 underline", children: "Use a different email" })
  ] }) });
}
function AccountDashboard({
  profile,
  onSave,
  onSignOut
}) {
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setForm(profile);
  }, [profile]);
  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2e3);
  }
  const hasHistoryNotes = form.notes.trim().length > 0;
  return /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "card p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "font-display text-2xl text-ink", children: "Welcome back" }),
          /* @__PURE__ */ jsx("p", { className: "text-ink/60 text-sm", children: profile.email })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: onSignOut, className: "btn-secondary", children: "Sign out" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-ink", children: "Name" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: form.name,
                onChange: (e) => setForm({ ...form, name: e.target.value }),
                placeholder: "Jamie Carter",
                className: "mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-600"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-ink", children: "Phone" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "tel",
                value: form.phone,
                onChange: (e) => setForm({ ...form, phone: e.target.value }),
                placeholder: "(555) 010-2200",
                className: "mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-600"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-ink", children: "Home address" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: form.address,
              onChange: (e) => setForm({ ...form, address: e.target.value }),
              placeholder: "118 Maple Ave, Riverdale",
              className: "mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-600"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-ink", children: "Preferred contact method" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: form.preferredContact,
              onChange: (e) => setForm({
                ...form,
                preferredContact: e.target.value
              }),
              className: "mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-600",
              children: [
                /* @__PURE__ */ jsx("option", { value: "email", children: "Email" }),
                /* @__PURE__ */ jsx("option", { value: "phone", children: "Phone call" }),
                /* @__PURE__ */ jsx("option", { value: "text", children: "Text message" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-ink", children: "Notes for our crew" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: form.notes,
              onChange: (e) => setForm({ ...form, notes: e.target.value }),
              placeholder: "Gate code, dog in the yard, that squeaky back door we looked at last spring...",
              rows: 4,
              className: "mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-600"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("button", { type: "submit", className: "btn", children: "Save my details" }),
          saved && /* @__PURE__ */ jsx("span", { className: "text-sm text-brand-600", children: "Saved on this device." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "card p-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-lg text-ink mb-2", children: "Service notes" }),
      hasHistoryNotes ? /* @__PURE__ */ jsx("p", { className: "text-ink/70", children: form.notes }) : /* @__PURE__ */ jsx("p", { className: "text-ink/60", children: "Nothing here yet. Add a note above about your home, like where the water shutoff is or which room needs attention next, and it'll show here for your next visit." }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-ink/40 mt-4", children: "This is saved right in your browser on this device only. It's not stored on a server anywhere, so it won't follow you to a new phone or computer." })
    ] })
  ] });
}
function App() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [pending, setPending] = useState(null);
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
  function handleLinkSent(email) {
    const p = { email, sentAt: Date.now() };
    localStorage.setItem(PENDING_KEY, JSON.stringify(p));
    setPending(p);
  }
  function handleConfirmed() {
    if (!pending) return;
    const existing = loadProfile();
    const newProfile = existing ?? {
      email: pending.email,
      name: "",
      phone: "",
      address: "",
      preferredContact: "email",
      notes: ""
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
  function handleSave(p) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    setProfile(p);
  }
  function handleSignOut() {
    localStorage.removeItem(PENDING_KEY);
    setPending(null);
    setProfile(null);
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-ink/[0.02] py-12 px-4", children: loading ? /* @__PURE__ */ jsx("div", { className: "max-w-xl mx-auto card p-8 text-center text-ink/60", children: "Loading your account..." }) : loadError ? /* @__PURE__ */ jsxs("div", { className: "max-w-xl mx-auto card p-8 text-center", children: [
    /* @__PURE__ */ jsx("p", { className: "text-ink/70 mb-4", children: "Something went sideways loading your saved details. Try refreshing the page." }),
    /* @__PURE__ */ jsx("button", { onClick: () => window.location.reload(), className: "btn-secondary", children: "Refresh" })
  ] }) : profile ? /* @__PURE__ */ jsx(
    AccountDashboard,
    {
      profile,
      onSave: handleSave,
      onSignOut: handleSignOut
    }
  ) : pending ? /* @__PURE__ */ jsx(
    ConfirmLink,
    {
      email: pending.email,
      onConfirmed: handleConfirmed,
      onCancel: handleCancelPending
    }
  ) : /* @__PURE__ */ jsx(SignedOutWelcome, { onLinkSent: handleLinkSent }) });
}
createRoot(document.getElementById("tibly-app-root")).render(/* @__PURE__ */ jsx(App, {}));
