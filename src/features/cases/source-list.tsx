type Source = {
  title: string;
  publisher: string;
  publishedAt: string;
  documentNumber?: string;
  url: string;
};

export function SourceList({ sources }: { sources: Source[] }) {
  return (
    <ol className="source-list" aria-label="Šaltiniai">
      {sources.map((source) => (
        <li key={`${source.url}-${source.title}`}>
          <a href={source.url} id={source.url.startsWith("#") ? source.url.slice(1) : undefined}>{source.title}</a>
          <p>
            {source.publisher} · <time dateTime={source.publishedAt}>{source.publishedAt}</time>
            {source.documentNumber ? ` · ${source.documentNumber}` : null}
          </p>
        </li>
      ))}
    </ol>
  );
}
