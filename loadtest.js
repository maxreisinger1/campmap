import http from "k6/http";
import { check, sleep } from "k6";

// Usage: k6 run -e SUPABASE_FUNCTION_URL=https://<project-id>.functions.supabase.co/submit_signup -e SUPABASE_ANON_KEY=your-anon-key loadtest.js

const SUPABASE_FUNCTION_URL =
  "https://isjntifmljeogvygwisd.supabase.co/functions/v1/submit_signup";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlzam50aWZtbGplb2d2eWd3aXNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMzk3MjYsImV4cCI6MjA3MDYxNTcyNn0.5u_4vZAI8KFo7LpMphLZ72Mbh6EMMMqbz-rK1tn88MM";

export let options = {
  vus: 10, // number of virtual users
  duration: "20s",
};

export default function () {
  const payload = JSON.stringify({
    name: `Test User ${Math.floor(Math.random() * 100000)}`,
    email: `testuser${Math.floor(Math.random() * 100000)}@example.com`,
    city: "Austin",
    state: "TX",
    zip: "73301",
    lat: 30.3264,
    lon: -97.7713,
  });

  // Generate a random IPv4 address for x-forwarded-for
  function randomIp() {
    return Array(4)
      .fill(0)
      .map(() => Math.floor(Math.random() * 256))
      .join(".");
  }

  const params = {
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "x-forwarded-for": randomIp(),
    },
  };

  const res = http.post(SUPABASE_FUNCTION_URL, payload, params);

  const success = check(res, {
    "status is 200 or 201": (r) => r.status === 200 || r.status === 201,
  });

  if (!success) {
    console.log(`Failed submission: status=${res.status}, body=${res.body}`);
  }

  sleep(1);
}
