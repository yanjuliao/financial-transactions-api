export interface Transaction {
  id: string;
  date: Date;
  price: number;
  type: 'ENTRADA' | 'SAIDA';
  category: string;
}
