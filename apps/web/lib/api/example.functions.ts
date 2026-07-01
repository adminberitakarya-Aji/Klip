import { z } from "zod";

import { getServerConfig } from "../config.server";

// Example server function. Call from a Next.js API route or Server Component:
//   const result = await getGreeting({ name: "Ada" })

const getGreetingInput = z.object({ name: z.string().min(1) });

export async function getGreeting(data: z.infer<typeof getGreetingInput>) {
  const parsed = getGreetingInput.parse(data);
  const config = getServerConfig();
  return {
    greeting: `Hello, ${parsed.name}!`,
    mode: config.nodeEnv ?? "unknown",
  };
}
