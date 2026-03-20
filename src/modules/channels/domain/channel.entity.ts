export class Channel {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string | null,
  ) {}

  // Tiene descripción?
  hasDescription(): boolean {
    return this.description !== null && this.description.trim().length > 0;
  }
}