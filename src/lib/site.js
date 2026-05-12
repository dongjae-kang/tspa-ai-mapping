export const FRAMEWORK_ROWS = [
  { key: 'tspa', label: 'TSPA Abuse Types' },
  { key: 'behavioral', label: 'Behavioral / authenticity-based enforcement' },
  { key: 'recommendation', label: 'Recommendation-system intervention' },
  { key: 'design', label: 'Design-level safety' },
];

export const PAPER_PDF_URL = `${import.meta.env.BASE_URL}paper/ai-era-ts-framework-mapping-paper.pdf`;

export const FIT_LABELS = {
  clean: 'Clean',
  partial: 'Partial',
  no_fit: 'No fit',
};

export const MISFIT_LABELS = {
  clean: 'Clean across all axes',
  patchable: 'Patchable',
  structural: 'Structural',
};

export const HARM_OPTIONS = [
  'Hateful Content',
  'Harassment',
  'Dangerous Misinformation',
  'Endangerment',
  'Impersonation',
  'Fraud',
  'Sexualized Abuse',
  'Privacy Violation',
  'Other',
];

export const ACTOR_OPTIONS = [
  'User-Originated',
  'User-Assisted-by-AI',
  'Platform-Generated',
  'Hybrid-Agency',
  'Recommender-Amplified',
  'Design-Layer',
];

export const DEFAULT_FILTERS = {
  search: '',
  year: 'all',
  platform: 'all',
  aiInvolvement: 'all',
  misfit: 'all',
};

export const FILTER_CONFIG = {
  year: {
    allLabel: 'All years',
  },
  platform: {
    allLabel: 'All platforms',
  },
  aiInvolvement: {
    allLabel: 'All types',
  },
  misfit: {
    allLabel: 'All classes',
  },
};

export function getYear(date) {
  return date.split('-')[0];
}

export function compareDatesDesc(left, right) {
  return right.date.localeCompare(left.date);
}

export function getOverallStatus(event) {
  const fits = Object.values(event.framework_mapping).map((axis) => axis.fit);

  if (fits.every((fit) => fit === 'clean') && event.misfit_classification === 'clean') {
    return {
      tone: 'clean',
      label: 'Clean fit',
    };
  }

  if (fits.some((fit) => fit === 'no_fit') || event.misfit_classification === 'structural') {
    return {
      tone: 'no-fit',
      label: 'Structural misfit',
    };
  }

  return {
    tone: 'partial',
    label: 'Patchable misfit',
  };
}

export function getUniqueOptions(events, selector) {
  const values = new Set();

  events.forEach((event) => {
    values.add(selector(event));
  });

  return Array.from(values).sort((left, right) => left.localeCompare(right));
}

export function getOptionCounts(events, selector) {
  const counts = new Map();

  events.forEach((event) => {
    const value = selector(event);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([value, count]) => ({
      value,
      count,
    }));
}

export function getEventFilterValue(event, filterName) {
  if (filterName === 'year') {
    return getYear(event.date);
  }

  if (filterName === 'platform') {
    return event.platform_family;
  }

  if (filterName === 'aiInvolvement') {
    return event.ai_involvement_type;
  }

  if (filterName === 'misfit') {
    return event.misfit_classification;
  }

  return '';
}

export function getCrossFilteredOptions(events, filters, filterName, baseOptions) {
  const workingFilters = {
    ...filters,
    [filterName]: 'all',
  };

  const workingSubset = events.filter((event) => matchesFilters(event, workingFilters));

  return {
    allLabel: FILTER_CONFIG[filterName].allLabel,
    allCount: workingSubset.length,
    options: baseOptions.map((option) => {
      const count = workingSubset.filter(
        (event) => getEventFilterValue(event, filterName) === option.value,
      ).length;

      return {
        ...option,
        count,
        disabled: count === 0 && filters[filterName] !== option.value,
      };
    }),
  };
}

export function matchesFilters(event, filters) {
  const normalizedSearch = filters.search.trim().toLowerCase();
  const matchesSearch =
    normalizedSearch.length === 0 ||
    `${event.title} ${event.description}`.toLowerCase().includes(normalizedSearch);

  const matchesYear = filters.year === 'all' || getYear(event.date) === filters.year;
  const matchesPlatform =
    filters.platform === 'all' || event.platform_family === filters.platform;
  const matchesAI =
    filters.aiInvolvement === 'all' || event.ai_involvement_type === filters.aiInvolvement;
  const matchesMisfit =
    filters.misfit === 'all' || event.misfit_classification === filters.misfit;

  return matchesSearch && matchesYear && matchesPlatform && matchesAI && matchesMisfit;
}

export function buildDualCodingKey(harm, actor) {
  return `${harm}_${actor}`;
}

export function getDefaultRecommendation(actor) {
  const recommendationMap = {
    'User-Originated': 'taxonomy refinement',
    'User-Assisted-by-AI': 'taxonomy refinement',
    'Platform-Generated': 'model governance',
    'Hybrid-Agency': 'taxonomy refinement',
    'Recommender-Amplified': 'recommender accountability',
    'Design-Layer': 'design intervention',
  };

  return recommendationMap[actor] ?? 'taxonomy refinement';
}

export function getFallbackDualCodingCopy(harm, actor) {
  return {
    harmOnly: `Under harm-axis coding alone, this event would be classified as ${harm}.`,
    actorInsight: `Adding actor-axis coding ${actor} surfaces a producer of harm that conventional user-centered moderation does not target directly.`,
    recommendedResponse: getDefaultRecommendation(actor),
  };
}

export function getDiagnosticDefaultEvent(events) {
  return events.find((event) => event.id === 'evt-meta-ai-discover-feed') ?? events[0] ?? null;
}
