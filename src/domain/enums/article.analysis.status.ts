// domain/enums/task.status.ts

export enum ArticleAnalysisStatus {
  PENDING = 'pending', // Analyse en attente
  IN_PROGRESS = 'in_progress', // Analyse en cours
  COMPLETED = 'completed', // Analyse terminée avec succès
  FAILED = 'failed', // Échec de l'analyse
  SKIPPED = 'skipped', // Analyse volontairement ignorée
  RETRY = 'retry', // Analyse échouée mais programmée pour une nouvelle tentative
  EXPIRED = 'expired', // Analyse annulée car hors délai
}
