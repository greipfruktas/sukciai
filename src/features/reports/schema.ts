import { z } from "zod";

const isoDate = z.string().date().refine((value) => value <= new Date().toISOString().slice(0, 10), "Data negali būti ateityje");

export const consumerReportSchema = z.object({
  reporter: z.object({
    name: z.string().trim().min(3).max(160),
    email: z.email().transform((value) => value.trim().toLowerCase()),
    phone: z.string().trim().min(8).max(24),
  }),
  sellerIdentifiers: z.array(z.object({
    type: z.enum(["phone", "iban", "company_code", "name", "website", "facebook"]),
    value: z.string().trim().min(2).max(500),
  })).min(1).max(20),
  description: z.string().trim().min(30).max(10_000),
  amountCents: z.number().int().min(1).max(1_000_000_000),
  paymentDate: isoDate,
  promisedDate: z.string().date().optional(),
  workStatus: z.enum(["not_done", "partially_done", "late", "defective"]),
  officialReference: z.string().trim().max(500).optional(),
  authenticityConfirmed: z.literal(true),
});

export type ConsumerReportInput = z.input<typeof consumerReportSchema>;
export type ValidatedConsumerReport = z.output<typeof consumerReportSchema>;
