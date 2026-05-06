import { MISFIT_LABELS, getOverallStatus } from '../lib/site.js';

function EventList({ events, selectedEventId, onSelect, onClear }) {
  const buttonRefs = [];

  function handleArrowNavigation(index, direction) {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= buttonRefs.length) {
      return;
    }

    buttonRefs[nextIndex]?.focus();
  }

  if (events.length === 0) {
    return (
      <div className="empty-card">
        <p>No events match these filters.</p>
        <button type="button" className="text-button" onClick={onClear}>
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="event-list-panel">
      <div className="section-heading compact">
        <h3>Event list</h3>
        <p>{events.length} visible</p>
      </div>
      <ul className="event-list">
        {events.map((event, index) => {
          const overallStatus = getOverallStatus(event);
          const isSelected = selectedEventId === event.id;

          return (
            <li key={event.id}>
              <button
                type="button"
                ref={(node) => {
                  buttonRefs[index] = node;
                }}
                className={`event-row${isSelected ? ' selected' : ''}`}
                aria-current={isSelected ? 'true' : undefined}
                onClick={() => onSelect(event.id)}
                onKeyDown={(eventKey) => {
                  if (eventKey.key === 'ArrowDown') {
                    eventKey.preventDefault();
                    handleArrowNavigation(index, 1);
                  }

                  if (eventKey.key === 'ArrowUp') {
                    eventKey.preventDefault();
                    handleArrowNavigation(index, -1);
                  }
                }}
              >
                <div className="event-row-main">
                  <span
                    className={`status-dot ${overallStatus.tone}`}
                    aria-hidden="true"
                  />
                  <div className="event-row-text">
                    <span className="event-title">{event.title}</span>
                    <span className="event-meta">
                      {event.date} | {event.platforms.join(', ')}
                    </span>
                  </div>
                </div>
                <span className="event-status-text">
                  {MISFIT_LABELS[event.misfit_classification] ?? overallStatus.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default EventList;
