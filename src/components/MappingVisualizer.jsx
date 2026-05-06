import EventDetail from './EventDetail.jsx';
import EventFilters from './EventFilters.jsx';
import EventList from './EventList.jsx';

function MappingVisualizer({
  filters,
  filterOptions,
  filteredEvents,
  onFilterChange,
  onClearFilters,
  selectedEvent,
  selectedEventId,
  onSelectEvent,
}) {
  return (
    <section id="mapping-visualizer" className="section-block">
      <div className="section-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Section 1</p>
            <h2>Mapping Visualizer</h2>
          </div>
          <p className="section-summary">
            Browse the event dataset and inspect how each case maps onto the TSPA taxonomy,
            behavioral enforcement, recommendation intervention, and design-level safety.
          </p>
        </div>

        <div className="feature-grid">
          <aside className="column-left">
            <EventFilters
              filters={filters}
              options={filterOptions}
              onChange={onFilterChange}
              onClear={onClearFilters}
            />
            <EventList
              events={filteredEvents}
              selectedEventId={selectedEventId}
              onSelect={onSelectEvent}
              onClear={onClearFilters}
            />
          </aside>
          <div className="column-right">
            <EventDetail event={selectedEvent} hasResults={filteredEvents.length > 0} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default MappingVisualizer;
