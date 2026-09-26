export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(
      `Les vecteurs doivent avoir la même dimension : ${a.length} !== ${b.length}`
    );
  }
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) {
    throw new Error("Impossible de calculer la similarité cosinus avec un vecteur nul");
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}