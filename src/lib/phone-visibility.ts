export type PhoneVisibility = "public" | "after_approval" | "private";

export type WorkerSettings = {
  showName?: boolean;
  showDistrict?: boolean;
  phoneVisibility?: PhoneVisibility;
};

export function getPhoneVisibility(
  settings: WorkerSettings | null | undefined,
): PhoneVisibility {
  return settings?.phoneVisibility ?? "after_approval";
}

export function canSeePhone(
  settings: WorkerSettings | null | undefined,
  hasContact: boolean,
): boolean {
  const v = getPhoneVisibility(settings);
  if (v === "private") return false;
  if (v === "public") return true;
  return hasContact;
}
