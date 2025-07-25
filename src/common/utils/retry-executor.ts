import { Injectable } from '@nestjs/common';

@Injectable()
export class RetryExecutor {
  private UNEXPECTED_RETRY_EXECUTOR_FAILURE_MESSAGE =
    'unexpected_retry_executor_failure';
  private readonly attempts = 3;
  private readonly delayMs = 500;

  public async execute<T>(fn: () => Promise<T>): Promise<T> {
    let attempt = 0;

    while (attempt < this.attempts) {
      try {
        return await fn();
      } catch (error) {
        attempt++;
        if (attempt >= this.attempts) {
          throw new Error(`Error after ${this.attempts} attempts: ${error}`);
        }
        await this.delay(this.delayMs);
      }
    }

    throw new Error(this.UNEXPECTED_RETRY_EXECUTOR_FAILURE_MESSAGE);
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
