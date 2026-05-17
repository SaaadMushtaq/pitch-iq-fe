import { createClient } from "@supabase/supabase-js";

// ─── Helpers ────────────────────────────────────────────────────────────────

const pass = (msg: string) => console.log(`✅ ${msg}`);
const fail = (msg: string) => console.log(`❌ ${msg}`);

let allPassed = true;

function check(condition: boolean, passMsg: string, failMsg: string): boolean {
  if (condition) {
    pass(passMsg);
  } else {
    fail(failMsg);
    allPassed = false;
  }
  return condition;
}

// ─── 1. Env variable checks ──────────────────────────────────────────────────

console.log("\n── Checking environment variables ──────────────────────────────");

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

const urlOk = check(
  Boolean(supabaseUrl),
  `VITE_SUPABASE_URL is set  →  ${supabaseUrl}`,
  "VITE_SUPABASE_URL is missing from .env"
);

// Accept either standard anon key or the newer publishable key
const hasAnonKey = Boolean(anonKey);
const hasPublishableKey = Boolean(publishableKey);

if (hasAnonKey) {
  pass(`VITE_SUPABASE_ANON_KEY is set  →  ${anonKey!.slice(0, 20)}…`);
} else {
  fail(
    "VITE_SUPABASE_ANON_KEY is missing from .env" +
      (hasPublishableKey
        ? "\n   ⚠️  Found VITE_SUPABASE_PUBLISHABLE_KEY instead — your project uses the newer Supabase key format.\n      Rename it to VITE_SUPABASE_ANON_KEY (and update src/utils/supabase.ts) OR keep it as-is.\n      The connection test below will use VITE_SUPABASE_PUBLISHABLE_KEY as a fallback."
        : "")
  );
  if (!hasPublishableKey) allPassed = false;
}

// The key we'll actually use for the connection test
const activeKey = anonKey ?? publishableKey;

// ─── 2. Supabase client creation ─────────────────────────────────────────────

console.log("\n── Creating Supabase client ─────────────────────────────────────");

let clientOk = false;
let supabase: ReturnType<typeof createClient> | null = null;

if (urlOk && activeKey) {
  try {
    supabase = createClient(supabaseUrl!, activeKey);
    pass("Supabase client created successfully");
    clientOk = true;
  } catch (err) {
    fail(`Failed to create Supabase client: ${(err as Error).message}`);
    allPassed = false;
  }
} else {
  fail("Skipping client creation — missing URL or key");
  allPassed = false;
}

// ─── 3. Connection test ───────────────────────────────────────────────────────

console.log("\n── Testing Supabase connection ──────────────────────────────────");

if (clientOk && supabase) {
  try {
    const { error } = await supabase.auth.getSession();
    if (error) {
      fail(`supabase.auth.getSession() returned an error: ${error.message}`);
      allPassed = false;
    } else {
      pass("supabase.auth.getSession() succeeded (no error — connection is live)");
    }
  } catch (err) {
    fail(`supabase.auth.getSession() threw: ${(err as Error).message}`);
    allPassed = false;
  }
} else {
  fail("Skipping connection test — client was not created");
}

// ─── 4. Summary ───────────────────────────────────────────────────────────────

console.log("\n── Summary ──────────────────────────────────────────────────────");
if (allPassed) {
  console.log("🎉 All checks passed! Your Supabase frontend setup is correct.");
} else {
  console.log("⚠️  Some checks failed. Review the ❌ items above and fix them.");
}
console.log("");
