export function ThisWeekCard({
  awaitingSubmissions = 12,
  coursesUpdated = 2,
  assignmentsDueSoon = 1,
}) {
  return (
    <section className="t-card">
      <h2 className="t-h2">This Week</h2>
      <ul className="t-list">
        <li>{awaitingSubmissions} submissions awaiting review</li>
        <li>{coursesUpdated} courses updated</li>
        <li>{assignmentsDueSoon} assignment due soon</li>
      </ul>
      <p className="t-muted">(Placeholder stats — wire to real data later.)</p>
    </section>
  );
}
