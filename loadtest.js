import http from "k6/http";
import { check, sleep } from "k6";

// Usage: k6 run -e SUPABASE_FUNCTION_URL=https://<project-id>.functions.supabase.co/submit_signup -e SUPABASE_ANON_KEY=your-anon-key loadtest.js

const SUPABASE_FUNCTION_URL =
  "https://isjntifmljeogvygwisd.supabase.co/functions/v1/submit_signup";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlzam50aWZtbGplb2d2eWd3aXNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMzk3MjYsImV4cCI6MjA3MDYxNTcyNn0.5u_4vZAI8KFo7LpMphLZ72Mbh6EMMMqbz-rK1tn88MM";

export let options = {
  stages: [
    { duration: "10s", target: 10 }, // ramp to 50 VUs
    // { duration: "20s", target: 200 }, // then 200 VUs
    { duration: "20s", target: 0 }, // ramp down
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"], // <1% errors
    http_req_duration: ["p(95)<500"], // 95% < 500ms
  },
};

function rand(n) {
  return Math.floor(Math.random() * n);
}
function ip() {
  return [rand(255), rand(255), rand(255), rand(255)].join(".");
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  const payload = JSON.stringify({
    name: `User ${rand(1e7)}`,
    email: `user${rand(1e9)}@example.com`,
    city: "Austin",
    state: "TX",
    zip: "73301",
    lat: 30.3264,
    lon: -97.7713,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "x-forwarded-for": ip(),
      Origin: "https://camp-six.vercel.app/",
    },
    timeout: "60s",
  };

  const res = http.post(SUPABASE_FUNCTION_URL, payload, params);

  const ok = check(res, {
    "status 200/201": (r) => r.status === 200 || r.status === 201,
  });

  if (!ok) {
    console.log(`ERR ${res.status}: ${res.body}`);
  }

  sleep(0.5);
}
