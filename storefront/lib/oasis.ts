/**
 * OASIS integration for Q2P - Quest proof entitlements
 *
 * When the Entitlements API is implemented in ONODE, this client will:
 * - Fetch avatar's quest completion proofs
 * - Apply discounts at checkout based on proof tier
 *
 * @see Docs/QUEST_TO_PHYSICAL_Q2P_BUILD_PLAN.md
 */

const ONODE_URL = process.env.NEXT_PUBLIC_OASIS_ONODE_URL ?? 'http://localhost:5004';

export interface QuestProof {
  proofId: string;
  gameId: string;
  objectiveKey: string;
  tier: 'entry' | 'intermediate' | 'master';
  physicalReward?: {
    type: 'discount' | 'sku' | 'exclusive';
    value: number;
    skuIds?: string[];
  };
  redeemed: boolean;
}

export async function getEntitlements(token: string): Promise<QuestProof[]> {
  // TODO: Implement when GET /api/quest/entitlements is available
  const res = await fetch(`${ONODE_URL}/api/quest/entitlements`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.result ?? [];
}

export function getDiscountForProof(proof: QuestProof, skuId: string): number {
  if (proof.redeemed || !proof.physicalReward) return 0;
  if (proof.physicalReward.type === 'discount') {
    const skuIds = proof.physicalReward.skuIds;
    if (!skuIds || skuIds.length === 0 || skuIds.includes(skuId)) {
      return proof.physicalReward.value;
    }
  }
  return 0;
}
