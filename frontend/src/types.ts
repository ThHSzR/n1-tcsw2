export interface Usuario {
  idUsuario: number;
  nomeCompleto: string;
  email: string;
  dataCadastro: string;
}

export interface Categoria {
  idCategoria: number;
  nome: string;
  descricao?: string;
  _count?: { cursos: number; trilhas: number };
}

export interface Curso {
  idCurso: number;
  titulo: string;
  descricao?: string;
  nivel: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
  totalAulas: number;
  totalHoras: string | number;
  dataPublicacao?: string;
  categoria: Categoria;
  instrutor: Pick<Usuario, 'idUsuario' | 'nomeCompleto' | 'email'>;
  _count?: { modulos: number; matriculas: number };
}

export interface Paginated<T> {
  dados: T[];
  total: number;
  pagina: number;
  limite: number;
}

export interface Matricula {
  idMatricula: number;
  dataMatricula: string;
  dataConclusao?: string;
  usuario: Usuario;
  curso: Curso;
}

export interface Trilha {
  idTrilha: number;
  titulo: string;
  descricao?: string;
  categoria: Categoria;
  cursos: Array<{ ordem: number; curso: Curso }>;
}

export interface Plano {
  idPlano: number;
  nome: string;
  descricao?: string;
  preco: string | number;
  duracaoMeses: number;
  _count?: { assinaturas: number };
}

export interface Assinatura {
  idAssinatura: number;
  dataInicio: string;
  dataFim: string;
  usuario: Usuario;
  plano: Plano;
  pagamentos: Pagamento[];
}

export interface Pagamento {
  idPagamento: number;
  valorPago: string | number;
  dataPagamento: string;
  metodoPagamento: string;
  idTransacaoGateway: string;
}
