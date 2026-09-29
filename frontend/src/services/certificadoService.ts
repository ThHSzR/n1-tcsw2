import { api } from '../lib/api';
import { dateOnly, unsupported } from './helpers';

export interface Certificado {
  id: number;
  usuarioId: number;
  cursoId: number;
  trilhaId: number | null;
  codigoVerificacao: string;
  dataEmissao: string;
}

interface CertificadoApi { idCertificado: number; idUsuario: number; idCurso: number; idTrilha: number | null; codigoVerificacao: string; dataEmissao: string }
const mapCertificado = (item: CertificadoApi): Certificado => ({ id: item.idCertificado, usuarioId: item.idUsuario, cursoId: item.idCurso, trilhaId: item.idTrilha, codigoVerificacao: item.codigoVerificacao, dataEmissao: dateOnly(item.dataEmissao) });

export const certificadoService = {
  getAll: (): Promise<Certificado[]> =>
    api<CertificadoApi[]>('/certificados').then(items => items.map(mapCertificado)),
  getById: (id: number): Promise<Certificado> =>
    api<CertificadoApi[]>('/certificados').then(items => {
      const item = items.find(value => value.idCertificado === id);
      if (!item) throw new Error('Certificado não encontrado');
      return mapCertificado(item);
    }),
  create: (data: Omit<Certificado, 'id'>): Promise<Certificado> =>
    api<CertificadoApi>('/certificados', { method: 'POST', body: JSON.stringify({ idUsuario: data.usuarioId, idCurso: data.cursoId, ...(data.trilhaId ? { idTrilha: data.trilhaId } : {}) }) }).then(mapCertificado),
  update: async (_id: number, _data: Partial<Omit<Certificado, 'id'>>): Promise<Certificado> => unsupported('Edição de certificados'),
  remove: async (_id: number): Promise<void> => unsupported('Exclusão de certificados'),
};
