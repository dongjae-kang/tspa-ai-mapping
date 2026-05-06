function EventFilters({ filters, options, onChange, onClear, hasNoResults }) {
  return (
    <div className="filters-panel" aria-label="Event filters">
      <div className="filters-header">
        <h3>Filter events</h3>
        <button type="button" className="text-button" onClick={onClear}>
          Clear filters
        </button>
      </div>
      <label className="field">
        <span>Search</span>
        <input
          type="search"
          name="search"
          value={filters.search}
          onChange={onChange}
          placeholder="Search title or description"
        />
      </label>
      {hasNoResults ? <p className="filter-note">No events match these filters.</p> : null}
      <div className="filter-grid">
        <label className="field">
          <span>Year</span>
          <select name="year" value={filters.year} onChange={onChange}>
            <option value="all">{options.years.allLabel} ({options.years.allCount})</option>
            {options.years.options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={option.disabled ? 'muted-option' : ''}
              >
                {option.label} ({option.count})
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Platform</span>
          <select name="platform" value={filters.platform} onChange={onChange}>
            <option value="all">{options.platforms.allLabel} ({options.platforms.allCount})</option>
            {options.platforms.options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={option.disabled ? 'muted-option' : ''}
              >
                {option.label} ({option.count})
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>AI involvement</span>
          <select
            name="aiInvolvement"
            value={filters.aiInvolvement}
            onChange={onChange}
          >
            <option value="all">{options.aiTypes.allLabel} ({options.aiTypes.allCount})</option>
            {options.aiTypes.options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={option.disabled ? 'muted-option' : ''}
              >
                {option.label} ({option.count})
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Misfit class</span>
          <select name="misfit" value={filters.misfit} onChange={onChange}>
            <option value="all">{options.misfits.allLabel} ({options.misfits.allCount})</option>
            {options.misfits.options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={option.disabled ? 'muted-option' : ''}
              >
                {option.label} ({option.count})
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

export default EventFilters;
