import { PgBoss } from "pg-boss";

const ingestionQueueName = "ingest-source";

export interface QueueSender {
  send(name: string, data: object): Promise<string | null>;
}

export class QueueUnavailableError extends Error {
  constructor() {
    super("The ingestion queue did not accept the job");
    this.name = "QueueUnavailableError";
  }
}

export function createQueue(connectionString: string): PgBoss {
  return new PgBoss(connectionString);
}

export async function enqueueIngestion(
  sourceId: string,
  boss: QueueSender,
): Promise<string> {
  const jobId = await boss.send(ingestionQueueName, { sourceId });
  if (!jobId) throw new QueueUnavailableError();
  return jobId;
}
