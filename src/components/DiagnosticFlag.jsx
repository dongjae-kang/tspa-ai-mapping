import { useEffect, useState } from 'react';
import {
  ACTOR_OPTIONS,
  HARM_OPTIONS,
  buildDualCodingKey,
  getFallbackDualCodingCopy,
} from '../lib/site.js';

function buildResult({ title, description, harm, actor, lookup }) {
  const key = buildDualCodingKey(harm, actor);
  const copy = lookup[key] ?? getFallbackDualCodingCopy(harm, actor);

  return {
    title,
    description,
    harm,
    actor,
    copy,
  };
}

function ResultHeader() {
  const [isFresh, setIsFresh] = useState(true);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsFresh(false);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className={`result-header${isFresh ? ' fresh' : ''}`}>
      <p className="eyebrow">Step 3</p>
      <h3>Dual coding result</h3>
    </div>
  );
}

function DiagnosticFlag({ events, lookup, defaultEvent }) {
  const [mode, setMode] = useState('dataset');
  const [selectedEventId, setSelectedEventId] = useState(defaultEvent?.id ?? '');
  const [customDescription, setCustomDescription] = useState('');
  const [selectedHarm, setSelectedHarm] = useState(defaultEvent?.harm_type_primary ?? HARM_OPTIONS[0]);
  const [selectedActor, setSelectedActor] = useState(defaultEvent?.actor_axis ?? ACTOR_OPTIONS[0]);
  const [result, setResult] = useState(() =>
    defaultEvent
      ? buildResult({
          title: defaultEvent.title,
          description: defaultEvent.description,
          harm: defaultEvent.harm_type_primary,
          actor: defaultEvent.actor_axis,
          lookup,
        })
      : null,
  );
  const [errorMessage, setErrorMessage] = useState('');

  const currentEvent = events.find((event) => event.id === selectedEventId) ?? defaultEvent ?? null;
  const datasetResult = currentEvent
    ? buildResult({
        title: currentEvent.title,
        description: currentEvent.description,
        harm: selectedHarm,
        actor: selectedActor,
        lookup,
      })
    : null;
  const visibleResult = mode === 'dataset' ? datasetResult : result;
  const resultKey = `${selectedEventId}-${selectedHarm}-${selectedActor}`;

  function handleModeChange(nextMode) {
    if (nextMode === 'custom' && datasetResult) {
      setResult(datasetResult);
    }

    setMode(nextMode);
  }

  function handleDatasetEventChange(nextEventId) {
    const nextEvent = events.find((event) => event.id === nextEventId) ?? null;
    setSelectedEventId(nextEventId);

    if (nextEvent) {
      setSelectedHarm(nextEvent.harm_type_primary);
      setSelectedActor(nextEvent.actor_axis);
    }
  }

  function applyDualCoding() {
    const description =
      mode === 'dataset' ? currentEvent?.description ?? '' : customDescription.trim();

    if (!description) {
      setErrorMessage('Enter a short event description to continue.');
      return;
    }

    setErrorMessage('');

    setResult(buildResult({
      title: mode === 'dataset' ? currentEvent?.title ?? 'Selected dataset event' : 'New event description',
      description,
      harm: selectedHarm,
      actor: selectedActor,
      lookup,
    }));
  }

  return (
    <section id="diagnostic-flag" className="section-block diagnostic-section">
      <div className="section-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Section 2</p>
            <h2>Hybrid-Agency Diagnostic Flag</h2>
          </div>
          <p className="section-summary">
            Apply standard harm-axis coding and a parallel actor-axis classification to see what
            dual coding surfaces that single-axis moderation frameworks obscure.
          </p>
        </div>

        <div className="diagnostic-layout">
          <div className="diagnostic-card">
            <div className="step-block">
              <h3>Step 1 - Choose event</h3>
              <div className="tab-row" role="tablist" aria-label="Event input mode">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'dataset'}
                  className={`tab-button${mode === 'dataset' ? ' active' : ''}`}
                  onClick={() => handleModeChange('dataset')}
                >
                  Pick from dataset
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'custom'}
                  className={`tab-button${mode === 'custom' ? ' active' : ''}`}
                  onClick={() => handleModeChange('custom')}
                >
                  Describe a new event
                </button>
              </div>

              {mode === 'dataset' ? (
                <label className="field">
                  <span>Dataset event</span>
                  <select
                    value={selectedEventId}
                    onChange={(event) => handleDatasetEventChange(event.target.value)}
                  >
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <label className="field">
                  <span>Event description</span>
                  <textarea
                    rows="5"
                    value={customDescription}
                    onChange={(event) => setCustomDescription(event.target.value)}
                    placeholder="Describe the event in two to four sentences."
                  />
                </label>
              )}
            </div>

            <div className="step-block">
              <h3>Step 2 - Apply dual coding</h3>
              <div className="coding-grid">
                <fieldset className="selector-group">
                  <legend>Harm axis</legend>
                  <div className="chip-grid">
                    {HARM_OPTIONS.map((harm) => (
                      <label key={harm} className="chip-option">
                        <input
                          type="radio"
                          name="harm-axis"
                          value={harm}
                          checked={selectedHarm === harm}
                          onChange={(event) => setSelectedHarm(event.target.value)}
                        />
                        <span>{harm}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="selector-group">
                  <legend>Actor axis</legend>
                  <div className="chip-grid">
                    {ACTOR_OPTIONS.map((actor) => (
                      <label key={actor} className="chip-option">
                        <input
                          type="radio"
                          name="actor-axis"
                          value={actor}
                          checked={selectedActor === actor}
                          onChange={(event) => setSelectedActor(event.target.value)}
                        />
                        <span>{actor}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              {errorMessage ? <p className="field-error">{errorMessage}</p> : null}

              {mode === 'custom' ? (
                <button type="button" className="primary-button" onClick={applyDualCoding}>
                  Apply dual coding
                </button>
              ) : null}
            </div>
          </div>

          {visibleResult ? (
            <aside className="result-card" aria-live="polite">
              {mode === 'dataset' ? <ResultHeader key={resultKey} /> : (
                <div className="result-header">
                  <p className="eyebrow">Step 3</p>
                  <h3>Dual coding result</h3>
                </div>
              )}
              <p className="result-title">{visibleResult.title}</p>
              <p>{visibleResult.description}</p>
              <div className="result-tags">
                <span>
                  <strong>Harm:</strong> {visibleResult.harm}
                </span>
                <span>
                  <strong>Actor:</strong> {visibleResult.actor}
                </span>
              </div>
              <div className="result-copy">
                <p>{visibleResult.copy.harmOnly}</p>
                <p>{visibleResult.copy.actorInsight}</p>
                <p>
                  <strong>Recommended response category under dual coding:</strong>{' '}
                  {visibleResult.copy.recommendedResponse}
                </p>
              </div>
              <p className="result-note">
                This is a working prototype of Recommendation 4 in the accompanying paper.
              </p>
            </aside>
          ) : (
            <aside className="result-card empty-card">
              <p>Apply dual coding to generate a comparative result.</p>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}

export default DiagnosticFlag;
