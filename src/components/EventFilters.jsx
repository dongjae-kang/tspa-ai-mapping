function EventFilters({ filters, options, onChange, onClear }) {
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
      <div className="filter-grid">
        <label className="field">
          <span>Year</span>
          <select name="year" value={filters.year} onChange={onChange}>
            <option value="all">All years</option>
            {options.years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Platform</span>
          <select name="platform" value={filters.platform} onChange={onChange}>
            <option value="all">All platforms</option>
            {options.platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
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
            <option value="all">All types</option>
            {options.aiTypes.map((aiType) => (
              <option key={aiType} value={aiType}>
                {aiType}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Misfit class</span>
          <select name="misfit" value={filters.misfit} onChange={onChange}>
            <option value="all">All classes</option>
            {options.misfits.map((misfit) => (
              <option key={misfit} value={misfit}>
                {misfit}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

export default EventFilters;
