type TimelineEvent = {
  date: string;
  title: string;
  description?: string;
  sourceUrl: string;
};

export function Timeline({ events }: { events: TimelineEvent[] }) {
  const ordered = [...events].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <ol className="timeline">
      {ordered.map((event) => (
        <li key={`${event.date}-${event.title}`}>
          <time dateTime={event.date}>{event.date}</time>
          <div>
            <h3>{event.title}</h3>
            {event.description ? <p>{event.description}</p> : null}
            <a href={event.sourceUrl}>Įvykio šaltinis</a>
          </div>
        </li>
      ))}
    </ol>
  );
}
