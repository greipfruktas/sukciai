import Link from "next/link";

export default function ReviewQueuePage() {
  return (
    <main>
      <p className="eyebrow">Administravimas</p>
      <h1>Patvirtinimo eilė</h1>
      <ul className="review-queue">
        <li><Link href="/admin/review/demo">Pradėtas tyrimas dėl savivaldybės išlaidų</Link><span>1 perspėjimas</span></li>
      </ul>
    </main>
  );
}
