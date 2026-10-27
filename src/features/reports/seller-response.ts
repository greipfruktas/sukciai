interface SellerResponseInput {
  contact: string;
  startedAt: Date;
  urgentRisk: boolean;
}

export function startSellerResponsePeriod(input: SellerResponseInput) {
  if (!input.contact.trim()) throw new Error("Pardavėjo kontaktas privalomas");
  const deadline = new Date(input.startedAt);
  deadline.setUTCDate(deadline.getUTCDate() + 7);
  return { deadline, mayPublishBeforeDeadline: input.urgentRisk };
}
