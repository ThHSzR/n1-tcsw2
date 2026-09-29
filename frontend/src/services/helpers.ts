export function dateOnly(value?: string | null): string {
  return value ? value.slice(0, 10) : '';
}

export function unsupported(operation: string): never {
  throw new Error(`${operation} não é oferecido pela API atual.`);
}
