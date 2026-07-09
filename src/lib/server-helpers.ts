import type { BirthProfile, Membership } from "@prisma/client";
import { BirthInput, PlanType, Profile, makeProfile } from "@/lib/rules";

export function quotaForPlan(plan: PlanType) {
  if (plan === "premium") return 10;
  if (plan === "yearly") return 3;
  return 1;
}

export function normalizePlan(plan?: string | null): PlanType {
  return plan === "trial" || plan === "yearly" || plan === "premium" ? plan : "free";
}

export function birthProfileToClient(profile: BirthProfile): { birth: BirthInput; profile: Profile } {
  const birth: BirthInput = {
    nickname: profile.name,
    gender: profile.gender,
    birthDate: profile.birthDate.toISOString().slice(0, 10),
    birthHour: profile.birthTime,
    birthPlace: profile.birthPlace ?? "",
    accurateTime: true,
  };

  return { birth, profile: makeProfile(birth) };
}

export function membershipPayload(membership: Membership | null | undefined) {
  const plan = normalizePlan(membership?.planType);
  return {
    plan,
    quota: membership?.liuyaoQuotaMonthly ?? quotaForPlan(plan),
    used: membership?.liuyaoQuotaUsed ?? 0,
    status: membership?.status ?? "active",
  };
}
