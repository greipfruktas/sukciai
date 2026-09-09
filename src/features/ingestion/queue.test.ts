import { describe, expect, it } from "vitest";
import { enqueueIngestion, QueueUnavailableError } from "./queue";

describe("enqueueIngestion", () => {
  it("returns the durable job identifier", async () => {
    const boss = { send: async () => "job-42" };

    await expect(enqueueIngestion("source-7", boss)).resolves.toBe("job-42");
  });

  it("reports when the queue cannot accept a job", async () => {
    const boss = { send: async () => null };

    await expect(enqueueIngestion("source-7", boss)).rejects.toBeInstanceOf(
      QueueUnavailableError,
    );
  });
});
