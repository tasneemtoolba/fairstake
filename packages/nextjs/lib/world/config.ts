export type WorldConfig = {
  appId: `app_${string}`;
  action: string;
  rpId: `rp_${string}`;
  signingKey: string;
  environment: "production" | "staging" | "sandbox";
};

export function getServerWorldConfig(): WorldConfig | null {
  const appId = process.env.WORLD_APP_ID ?? process.env.NEXT_PUBLIC_WORLD_APP_ID;
  const action = process.env.WORLD_ACTION_ID ?? process.env.NEXT_PUBLIC_WORLD_ACTION_ID;
  const rpId = process.env.WORLD_RP_ID;
  const signingKey = process.env.WORLD_RP_SIGNING_KEY;

  if (!appId || !action || !rpId || !signingKey) {
    return null;
  }

  return {
    appId: appId as `app_${string}`,
    action,
    rpId: rpId as `rp_${string}`,
    signingKey,
    environment: (process.env.WORLD_ENVIRONMENT as WorldConfig["environment"]) ?? "staging",
  };
}

export function isClientWorldConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_WORLD_APP_ID && process.env.NEXT_PUBLIC_WORLD_ACTION_ID);
}
