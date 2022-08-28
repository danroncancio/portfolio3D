export default function lerp(
  start: number,
  end: number,
  amount: number
): number {
  return (1 - amount) * start + amount * end;
}
