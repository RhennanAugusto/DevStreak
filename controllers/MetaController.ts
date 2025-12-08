import { CompletionService } from "@/services/CompletionService";
import { MetaService } from "@/services/MetaService";
import { HabitCompletion, Metas } from "@/types/database_type";

export class MetaController {
  private metaService: MetaService;
  private completionService: CompletionService;

  constructor() {
    this.metaService = new MetaService();
    this.completionService = new CompletionService();
  }

  async buscarMetasDoUsuario(userId: string): Promise<Metas[]> {
    return await this.metaService.listarPorUsuario(userId);
  }

  async criarMeta(metaData: {
    user_id: string;
    title: string;
    descricao: string;
    frequencia: string;
  }): Promise<Metas> {
    const dataCompleta = {
      ...metaData,
      contagem_sequencia: 0,
      ultima_vez: new Date().toISOString(),
      criado_em: new Date().toISOString(),
    };
    return await this.metaService.criar(dataCompleta);
  }

  async deletarMeta(metaId: string): Promise<void> {
    await this.metaService.deletar(metaId);
  }

  async completarMeta(metaId: string, userId: string, metaAtual: Metas): Promise<void> {
    const currentDate = new Date().toISOString();

    // Criar completion
    await this.completionService.criar({
      habit_id: metaId,
      user_id: userId,
      completede_at: currentDate,
    });

    // Atualizar contagem de sequência
    await this.metaService.atualizar(metaId, {
      contagem_sequencia: metaAtual.contagem_sequencia + 1,
      ultima_vez: currentDate,
    });
  }

  async buscarCompletacoesDeHoje(userId: string): Promise<string[]> {
    const completions = await this.completionService.listarCompletacoesDeHoje(userId);
    return completions.map((c) => c.habit_id);
  }

  async buscarTodasCompletacoes(userId: string): Promise<HabitCompletion[]> {
    return await this.completionService.listarPorUsuario(userId);
  }
}

