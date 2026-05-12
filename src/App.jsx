import { useEffect, useState } from 'react';
import AboutSection from './components/AboutSection.jsx';
import DiagnosticFlag from './components/DiagnosticFlag.jsx';
import MappingVisualizer from './components/MappingVisualizer.jsx';
import {
  DEFAULT_FILTERS,
  MISFIT_LABELS,
  getCrossFilteredOptions,
  getDiagnosticDefaultEvent,
  getOptionCounts,
  getYear,
  matchesFilters,
} from './lib/site.js';

function App() {
  const [events, setEvents] = useState([]);
  const [lookup, setLookup] = useState({});
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    let isActive = true;

    async function loadData() {
      try {
        setLoading(true);

        const basePath = import.meta.env.BASE_URL;
        const [eventsResponse, lookupResponse] = await Promise.all([
          fetch(`${basePath}data/events.json`),
          fetch(`${basePath}data/dual-coding-lookup.json`),
        ]);

        if (!eventsResponse.ok || !lookupResponse.ok) {
          throw new Error('The site data could not be loaded.');
        }

        const [eventPayload, lookupPayload] = await Promise.all([
          eventsResponse.json(),
          lookupResponse.json(),
        ]);

        if (!isActive) {
          return;
        }

        const loadedEvents = [...eventPayload];
        setEvents(loadedEvents);
        setLookup(lookupPayload);
        setSelectedEventId(loadedEvents[0]?.id ?? null);
        setErrorMessage('');
      } catch (error) {
        if (!isActive) {
          return;
        }

        setErrorMessage(error instanceof Error ? error.message : 'The site data could not be loaded.');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isActive = false;
    };
  }, []);

  const baseFilterOptions = {
    years: getOptionCounts(events, (event) => getYear(event.date)).map(({ value, count }) => ({
      value,
      label: value,
      count,
    })),
    platforms: getOptionCounts(events, (event) => event.platform_family).map(({ value, count }) => ({
      value,
      label: value,
      count,
    })),
    aiTypes: getOptionCounts(events, (event) => event.ai_involvement_type).map(({ value, count }) => ({
      value,
      label: value,
      count,
    })),
    misfits: getOptionCounts(events, (event) => event.misfit_classification).map(({ value, count }) => ({
      value,
      label: MISFIT_LABELS[value] ?? value,
      count,
    })),
  };

  const filterOptions = {
    years: getCrossFilteredOptions(events, filters, 'year', baseFilterOptions.years),
    platforms: getCrossFilteredOptions(events, filters, 'platform', baseFilterOptions.platforms),
    aiTypes: getCrossFilteredOptions(
      events,
      filters,
      'aiInvolvement',
      baseFilterOptions.aiTypes,
    ),
    misfits: getCrossFilteredOptions(events, filters, 'misfit', baseFilterOptions.misfits),
  };

  const filteredEvents = events.filter((event) => matchesFilters(event, filters));

  useEffect(() => {
    if (filteredEvents.length === 0) {
      setSelectedEventId(null);
      return;
    }

    if (!selectedEventId) {
      setSelectedEventId(filteredEvents[0].id);
      return;
    }

    const selectedStillVisible = filteredEvents.some((event) => event.id === selectedEventId);

    if (!selectedStillVisible) {
      setSelectedEventId(filteredEvents[0].id);
    }
  }, [filteredEvents, selectedEventId]);

  const selectedEvent =
    filteredEvents.find((event) => event.id === selectedEventId) ?? null;

  const defaultDiagnosticEvent = getDiagnosticDefaultEvent(events);

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <nav className="top-nav" aria-label="Primary">
        <div className="section-shell nav-inner">
          <span className="nav-title">AI-Era T&amp;S Framework Mapping</span>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#mapping-visualizer">Mapping Visualizer</a>
            <a href="#diagnostic-flag">Diagnostic Flag</a>
          </div>
        </div>
      </nav>

      <main id="main-content">
        <AboutSection />

        {loading ? (
          <section className="section-block">
            <div className="section-shell">
              <div className="empty-card">
                <p>Loading site data.</p>
              </div>
            </div>
          </section>
        ) : null}

        {errorMessage ? (
          <section className="section-block">
            <div className="section-shell">
              <div className="empty-card">
                <p>{errorMessage}</p>
              </div>
            </div>
          </section>
        ) : null}

        {!loading && !errorMessage ? (
          <>
            <MappingVisualizer
              filters={filters}
              filterOptions={filterOptions}
              filteredEvents={filteredEvents}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              selectedEvent={selectedEventId ? selectedEvent : null}
              selectedEventId={selectedEventId}
              onSelectEvent={setSelectedEventId}
            />
            <DiagnosticFlag
              events={events}
              lookup={lookup}
              defaultEvent={defaultDiagnosticEvent}
            />
          </>
        ) : null}
      </main>

      <footer className="site-footer">
        <div className="section-shell">
          <p>
            Site infrastructure built with assistance from ChatGPT Codex; dataset
            construction, framework-mapping coding, and analytical framework are author work.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
