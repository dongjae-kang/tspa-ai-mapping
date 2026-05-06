import { FIT_LABELS, FRAMEWORK_ROWS, MISFIT_LABELS } from '../lib/site.js';

function EventDetail({ event, hasResults }) {
  if (!event) {
    return (
      <div className="detail-panel empty-card">
        <p>
          {hasResults
            ? 'Select an event from the list to see its framework mapping.'
            : 'No events match these filters.'}
        </p>
      </div>
    );
  }

  return (
    <article className="detail-panel" aria-labelledby={`event-${event.id}`}>
      <header className="detail-header">
        <div>
          <p className="eyebrow">Selected event</p>
          <h3 id={`event-${event.id}`}>{event.title}</h3>
        </div>
        <div className="detail-metadata">
          <p>
            <strong>Date:</strong> {event.date}
          </p>
          <p>
            <strong>Platforms:</strong> {event.platforms.join(', ')}
          </p>
          <p>
            <strong>AI involvement type:</strong> {event.ai_involvement_type}
          </p>
        </div>
      </header>

      <section className="detail-section">
        <h4>Event description</h4>
        <p>{event.description}</p>
      </section>

      <section className="detail-section">
        <h4>Framework mapping</h4>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Framework axis</th>
                <th scope="col">Fit status</th>
                <th scope="col">Reason for misfit</th>
              </tr>
            </thead>
            <tbody>
              {FRAMEWORK_ROWS.map((row) => {
                const mapping = event.framework_mapping[row.key];
                const fitLabel = FIT_LABELS[mapping.fit] ?? mapping.fit;

                return (
                  <tr key={row.key}>
                    <th scope="row">{row.label}</th>
                    <td>
                      <span className={`fit-badge ${mapping.fit}`}>{fitLabel}</span>
                    </td>
                    <td>{mapping.reason}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="detail-section">
        <h4>Misfit classification</h4>
        <p className="classification-line">
          <span className="classification-label">
            {MISFIT_LABELS[event.misfit_classification] ?? event.misfit_classification}
          </span>
        </p>
        <p>{event.misfit_rationale}</p>
      </section>

      <section className="detail-section">
        <h4>Source citations</h4>
        <ul className="source-list">
          {event.sources.map((source) => (
            <li key={`${source.publication}-${source.url}`}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.publication}
              </a>
              <span>
                {' '}
                | {source.title} | {source.date}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

export default EventDetail;
