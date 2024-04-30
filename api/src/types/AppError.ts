export class AppError extends Error {
  managed: boolean;

  constructor(managed: boolean = false, message?: string) {
    super(message);
    this.managed = managed;
  }
}
