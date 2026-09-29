import { unsupported } from './helpers';

export interface Nivel {
  id: number;
  nome: string;
}

export const nivelService = {
  getAll: (): Promise<Nivel[]> =>
    Promise.resolve([
      { id: 1, nome: 'Iniciante' },
      { id: 2, nome: 'Intermediário' },
      { id: 3, nome: 'Avançado' },
    ]),
  create: async (_data: Omit<Nivel, 'id'>): Promise<Nivel> => unsupported('Cadastro de níveis'),
  update: async (_id: number, _data: Partial<Omit<Nivel, 'id'>>): Promise<Nivel> => unsupported('Edição de níveis'),
  remove: async (_id: number): Promise<void> => unsupported('Exclusão de níveis'),
};
