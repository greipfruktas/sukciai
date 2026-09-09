import { ReviewPanel } from "@/features/admin/review-panel";

export default function ReviewPage() {
  return (
    <main>
      <ReviewPanel draft={{
        title: "Pradėtas tyrimas dėl savivaldybės išlaidų",
        status: "Pradėtas tyrimas",
        reasons: ["SENSITIVE_STATUS"],
        claims: [{
          text: "Prokuratūra pradėjo tyrimą.",
          quote: "pradėtas ikiteisminis tyrimas",
          sourceTitle: "Prokuratūros pranešimas",
          sourceUrl: "https://prokuraturos.lt/pranesimas",
        }],
      }} />
    </main>
  );
}
