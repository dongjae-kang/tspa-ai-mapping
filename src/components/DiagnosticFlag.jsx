import { useState } from 'react';
import {
  ACTOR_OPTIONS,
  HARM_OPTIONS,
  buildDualCodingKey,
  getFallbackDualCodingCopy,
} from '../lib/site.js';

function DiagnosticFlag({ events, lookup, defaultEvent }) {
  const [mode, setMode] = useState('dataset');
  const [selectedEventId, setSelectedEventId] = useState(defaultEvent?.id ?? '');
  const [customDescription, setCustomDescription] = useState('');
  const [selectedHarm, setSelectedHarm] = useState(defaultEvent?.harm_type_primary ?? HARM_OPTIONS[0]);
  const [selectedActor, setSelectedActor] = useState(defaultEvent?.actor_axis ?? ACTOR_OPTIONS[0]);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const currentEvent = events.find((event) => event.id === selectedEventId) ?? defaultEvent ?? null;

  function handleModeChange(nextMode) {
    setMode(nextMode);

    if (nextMode === 'dataset' && currentEvent) {
      setSelectedHarm(currentEvent.harm_type_primary);
      setSelectedActor(currentEvent.actor_axis);
    }
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

    const key = buildDualCodingKey(selectedHarm, selectedActor);
    const copy = lookup[key] ?? getFallbackDualCodingCopy(selectedHarm, selectedActor);

    setResult({
      title: mode === 'dataset' ? currentEvent?.title ?? 'Selected dataset event' : 'New event description',
      description,
      harm: selectedHarm,
      actor: selectedActor,
      copy,
    });
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

              <button type="button" className="primary-button" onClick={applyDualCoding}>
                Apply dual coding
              </button>
            </div>
          </div>

          {result ? (
            <aside className="result-card" aria-live="polite">
              <p className="eyebrow">Step 3</p>
              <h3>Dual coding result</h3>
              <p className="result-title">{result.title}</p>
              <p>{result.description}</p>
              <div className="result-tags">
                <span>
                  <strong>Harm:</strong> {result.harm}
                </span>
                <span>
                  <strong>Actor:</strong> {result.actor}
                </span>
              </div>
              <div className="result-copy">
                <p>{result.copy.harmOnly}</p>
                <p>{result.copy.actorInsight}</p>
                <p>
                  <strong>Recommended response category under dual coding:</strong>{' '}
                  {result.copy.recommendedResponse}
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
