import { z } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(20, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be at least 20 chars"),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(20, "SUPABASE_SERVICE_ROLE_KEY must be at least 20 chars")
    .optional(),
  VERCEL_TOKEN: z.string().optional(),
  RAILWAY_API_TOKEN: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

type Env = z.infer<typeof EnvSchema>;

let cached: Env | undefined;

function loadEnv(): Env {
  if (cached) return cached;

  const parsed = EnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    VERCEL_TOKEN: process.env.VERCEL_TOKEN,
    RAILWAY_API_TOKEN: process.env.RAILWAY_API_TOKEN,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });

  if (!parsed.success) {
    const formatted = parsed.error.flatten().fieldErrors;
    const messages = Object.entries(formatted)
      .map(([key, errs]) => `  - ${key}: ${errs?.join(", ") ?? "invalid"}`)
      .join("\n");
    throw new Error(
      `Environment validation failed:\n${messages}\n` +
        `Copy .env.example to .env.local and fill in the required vars.`,
    );
  }

  cached = parsed.data;
  return cached;
}

export const env = new Proxy({} as Env, {
  get(_target, prop: string | symbol) {
    const data = loadEnv();
    return data[prop as keyof Env];
  },
});
