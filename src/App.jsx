import { useEffect, useState } from 'react';
import AboutSection from './components/AboutSection.jsx';
import DiagnosticFlag from './components/DiagnosticFlag.jsx';
import MappingVisualizer from './components/MappingVisualizer.jsx';
import {
  DEFAULT_FILTERS,
  MISFIT_LABELS,
  getDiagnosticDefaultEvent,
  getUniqueOptions,
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

  const filterOptions = {
    years: getUniqueOptions(events, (event) => getYear(event.date)),
    platforms: getUniqueOptions(events, (event) => event.platform_family),
    aiTypes: getUniqueOptions(events, (event) => event.ai_involvement_type),
    misfits: getUniqueOptions(events, (event) => MISFIT_LABELS[event.misfit_classification] ?? event.misfit_classification),
  };

  const filteredEvents = events.filter((event) =>
    matchesFilters(event, {
      ...filters,
      misfit:
        filters.misfit === 'all'
          ? 'all'
          : Object.entries(MISFIT_LABELS).find(([, label]) => label === filters.misfit)?.[0] ?? filters.misfit,
    }),
  );

  useEffect(() => {
    if (!selectedEventId) {
      return;
    }

    const selectedStillVisible = filteredEvents.some((event) => event.id === selectedEventId);

    if (!selectedStillVisible) {
      setSelectedEventId(null);
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
            The author is solely responsible for any errors.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
