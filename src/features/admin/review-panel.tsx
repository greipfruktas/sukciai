interface ReviewDraft {
  title: string;
  status: string;
  reasons: string[];
  claims: Array<{
    text: string;
    quote: string;
    sourceTitle: string;
    sourceUrl: string;
  }>;
}

export function ReviewPanel({ draft }: { draft: ReviewDraft }) {
  return (
    <article className="review-panel">
      <header>
        <p className="eyebrow">Laukia patvirtinimo · {draft.status}</p>
        <h1>{draft.title}</h1>
        <ul className="reason-list" aria-label="Patikros perspėjimai">
          {draft.reasons.map((reason) => <li key={reason}>{reason}</li>)}
        </ul>
      </header>
      <div className="claim-review">
        {draft.claims.map((claim) => (
          <section key={`${claim.sourceUrl}-${claim.text}`}>
            <div><h2>Siūlomas teiginys</h2><p>{claim.text}</p></div>
            <div>
              <h2>Šaltinio ištrauka</h2>
              <blockquote>{claim.quote}</blockquote>
              <a href={claim.sourceUrl} rel="noreferrer" target="_blank">{claim.sourceTitle}</a>
            </div>
          </section>
        ))}
      </div>
      <footer className="review-actions">
        <button type="button">Atmesti</button>
        <button type="button" className="primary-action">Patvirtinti publikaciją</button>
      </footer>
    </article>
  );
}
