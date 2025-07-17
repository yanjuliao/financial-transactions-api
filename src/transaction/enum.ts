export enum Category {
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
  Category.SALARIO,
  Category.FREELANCER,
  Category.INVESTIMENTOS,
  Category.PRESENTE,
  Category.REEMBOLSO,
];

const expenseCategories = [
  Category.ALIMENTACAO,
  Category.MORADIA,
  Category.TRANSPORTE,
  Category.LAZER,
  Category.EDUCACAO,
  Category.SAUDE,
  Category.CONTAS,
  Category.OUTROS,
];

export function isCategoryValidForType(
  type: TransactionType,
  category: Category,
): boolean {
  if (type === TransactionType.ENTRADA) {
    return incomeCategories.includes(category);
  }
  if (type === TransactionType.SAIDA) {
    return expenseCategories.includes(category);
  }
  return false;
}
