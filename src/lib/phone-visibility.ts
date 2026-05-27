export type PhoneVisibility = "public" | "private";

export type WorkerSettings = {
  showDistrict?: boolean;
  phoneVisibility?: PhoneVisibility;
};

export function getPhoneVisibility(
  settings: WorkerSettings | null | undefined,
): PhoneVisibility {
  return settings?.phoneVisibility ?? "private";
}

export function canSeePhone(
  settings: WorkerSettings | null | undefined,
): boolean {
  return getPhoneVisibility(settings) === "public";
}
