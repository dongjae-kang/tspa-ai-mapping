function AboutSection() {
  return (
    <section id="about" className="about-section">
      <div className="section-shell prose-shell">
        <p className="eyebrow">Companion artifact to a final paper for TPIN7008IA, Spring 2026</p>
        <h1>AI-Era T&amp;S Framework Mapping</h1>
        <p className="about-copy">
          This site is the interactive companion to a Columbia SIPA final paper that tests
          existing Trust &amp; Safety classification frameworks against AI-related social media
          crisis events from November 2022 through April 2026. Section 1 lets you browse the
          event dataset and inspect, for each event, how it maps onto the TSPA Abuse Types
          taxonomy and three additional non-content T&amp;S axes. Section 2 is a working prototype
          of the paper&apos;s fourth policy recommendation: a Hybrid-Agency Diagnostic Flag that
          applies an actor-axis classification in parallel with the standard harm-axis coding.
        </p>
        <div className="thesis-block">
          <p className="thesis-label">Paper thesis</p>
          <blockquote>
            Existing Trust &amp; Safety frameworks are built on a foundational assumption: that
            harmful content is created by identifiable human agents and hosted on platforms that
            serve as intermediaries. Generative AI disrupts both sides of this assumption
            simultaneously. The content creator is no longer clearly human, and the platform
            itself may be the AI provider.
          </blockquote>
        </div>
        <div className="about-meta">
          <p>
            DongJae Kang | Principles and Practice of Online Trust &amp; Safety (TPIN7008IA),
            Columbia University SIPA, Spring 2026 | Instructor: Professor Tim Bernard
          </p>
          <a href="#paper" className="paper-link">
            Paper PDF (placeholder)
          </a>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
