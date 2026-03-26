export interface CategoryScoreData {
  pScore: number;
  prScore: number;
  mScore: number;
  pmfScore: number;
  revScore: number;
  tScore: number;
  totalScore: number;
  stage: string;
  weights: number[]; // [p, pr, m, pmf, rev, t]
  rawP: any;
  rawPr: any;
  rawM: any;
  rawPmf: any;
  rawRev: any;
  rawT: any;
}

export function getFundabilityScores(): CategoryScoreData {
  // Default to zero! Flatline for fresh user.
  let pScore = 0, prScore = 0, mScore = 0, pmfScore = 0, revScore = 0, tScore = 0;
  let rawP = null, rawPr = null, rawM = null, rawPmf = null, rawRev = null, rawT = null;

  // 1. Problem
  try {
    const d1 = JSON.parse(localStorage.getItem("audit_1_1_1") || localStorage.getItem("audit_1_1_1_v2") || "{}")?.data;
    if (d1 && Object.keys(d1).length > 0) {
      rawP = d1;
      pScore = Math.round(((parseInt(d1.severity)||1)*4 + (parseInt(d1.frequency)||1)*4 + ((11-(parseInt(d1.alternatives)||10))*2)) * 2);
      pScore = Math.min(100, Math.max(0, pScore));
    }
  } catch(e) {}

  // 4. Product
  try {
    const d4 = JSON.parse(localStorage.getItem("audit_1_1_4") || localStorage.getItem("audit_1_1_4_v2") || "{}");
    if (d4?.score !== undefined) { 
      prScore = d4.score; 
      rawPr = d4.data;
    }
  } catch(e) {}

  // 5. Market
  try {
    const d5 = JSON.parse(localStorage.getItem("audit_1_1_5") || "{}");
    if (d5?.score !== undefined) { 
      mScore = d5.score; 
      rawM = d5.data;
    }
  } catch(e) {}

  // 6. PMF
  try {
    const d6 = JSON.parse(localStorage.getItem("audit_1_1_6") || "{}");
    if (d6?.score !== undefined) { 
      pmfScore = d6.score; 
      rawPmf = d6.data;
    }
  } catch(e) {}

  // 7. Revenue
  try {
    const d7 = JSON.parse(localStorage.getItem("audit_1_1_7") || "{}");
    if (d7?.score !== undefined) {
      revScore = d7.score;
      rawRev = d7.data;
    } else if (d7?.data) {
      const d = d7.data;
      revScore = Math.round(((d.differentiation||1)*4 + (d.criticality||1)*4 + (11-(d.churnRisk||10))*2) * 2.5);
      rawRev = d;
    }
  } catch(e) {}

  // 8. Team
  try {
    const d8 = JSON.parse(localStorage.getItem("audit_1_1_8") || "{}");
    if (d8?.score !== undefined) {
      tScore = d8.score;
      rawT = d8.data;
    } else if (d8?.data) {
      const d = d8.data;
      tScore = Math.round((d.industryExpertise + d.functionalCoverage + d.executionTrackRecord + d.founderChemistry) * 2.5);
      rawT = d;
    }
  } catch(e) {}

  // Calculate Weights Dynamically based on phase
  let stage = "pre-revenue";
  let weights = [0.20, 0.20, 0.20, 0.10, 0.10, 0.20];
  
  // Rule heuristic for shifting:
  if (pmfScore > 60 && revScore > 30) {
    stage = "early-revenue";
    weights = [0.15, 0.15, 0.15, 0.20, 0.15, 0.20]; // Shift weight towards PMF and Revenue
  }

  // Consistent total score calculation
  const totalScore = Math.round(
    pScore * weights[0] + 
    prScore * weights[1] + 
    mScore * weights[2] + 
    pmfScore * weights[3] + 
    revScore * weights[4] + 
    tScore * weights[5]
  );

  return {
    pScore, prScore, mScore, pmfScore, revScore, tScore,
    totalScore, stage, weights,
    rawP, rawPr, rawM, rawPmf, rawRev, rawT
  };
}
