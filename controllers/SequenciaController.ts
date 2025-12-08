import { HabitCompletion, Metas } from "@/types/database_type";

export interface StreakData {
  streak: number;
  bestStreak: number;
  total: number;
}

export interface MetaComStreak {
  metas: Metas;
  streak: number;
  bestStreak: number;
  total: number;
}

export class SequenciaController {
  calcularStreakData(metaId: string, completions: HabitCompletion[]): StreakData {
    const metasCompletadas = completions
      .filter((c) => c.habit_id === metaId)
      .sort(
        (a, b) =>
          new Date(a.completede_at).getTime() -
          new Date(b.completede_at).getTime()
      );

    if (metasCompletadas.length === 0) {
      return { streak: 0, bestStreak: 0, total: 0 };
    }

    let streak = 0;
    let bestStreak = 0;
    let total = metasCompletadas.length;

    let lastDate: Date | null = null;
    let currentStreak = 0;

    metasCompletadas.forEach((c) => {
      const date = new Date(c.completede_at);
      if (lastDate) {
        const diff =
          (date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

        if (diff <= 1.5) {
          currentStreak += 1;
        } else {
          if (currentStreak > bestStreak) bestStreak = currentStreak;
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }

      if (currentStreak > bestStreak) bestStreak = currentStreak;
      streak = currentStreak;
      lastDate = date;
    });

    return { streak, bestStreak, total };
  }

  calcularMetasComStreak(
    metas: Metas[],
    completions: HabitCompletion[]
  ): MetaComStreak[] {
    return metas
      .map((meta) => {
        const { streak, bestStreak, total } = this.calcularStreakData(
          meta.$id,
          completions
        );
        return { metas: meta, bestStreak, streak, total };
      })
      .filter((item) => item.total > 0)
      .sort((a, b) => a.bestStreak - b.bestStreak);
  }
}

