export enum CategoryType {
  // RECEITAS
  SALARIO = 'SALARIO',
  FREELANCER = 'FREELANCER',
  INVESTIMENTOS = 'INVESTIMENTOS',
  PRESENTE = 'PRESENTE',
  REEMBOLSO = 'REEMBOLSO',

  // DESPESAS
  ALIMENTACAO = 'ALIMENTACAO',
  MORADIA = 'MORADIA',
  TRANSPORTE = 'TRANSPORTE',
  LAZER = 'LAZER',
  EDUCACAO = 'EDUCACAO',
  SAUDE = 'SAUDE',
  CONTAS = 'CONTAS',
  OUTROS = 'OUTROS',
}

export enum TransactionType {
  ENTRADA = 'ENTRADA',
  SAIDA = 'SAIDA',
}

const incomeCategories = [
  CategoryType.SALARIO,
  CategoryType.FREELANCER,
  CategoryType.INVESTIMENTOS,
  CategoryType.PRESENTE,
  CategoryType.REEMBOLSO,
];

const expenseCategories = [
  CategoryType.ALIMENTACAO,
  CategoryType.MORADIA,
  CategoryType.TRANSPORTE,
  CategoryType.LAZER,
  CategoryType.EDUCACAO,
  CategoryType.SAUDE,
  CategoryType.CONTAS,
  CategoryType.OUTROS,
];

export function isCategoryValidForType(
  type: TransactionType,
  category: CategoryType,
): boolean {
  if (type === TransactionType.ENTRADA) {
    return incomeCategories.includes(category);
  }
  if (type === TransactionType.SAIDA) {
    return expenseCategories.includes(category);
  }
  return false;
}
