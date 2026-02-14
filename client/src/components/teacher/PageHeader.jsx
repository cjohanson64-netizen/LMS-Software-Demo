export function PageHeader({ title, subtitle, rightSlot }) {
  return (
    <div className="t-row t-header">
      <div>
        <h1 className="t-h1">{title}</h1>
        {subtitle ? <p className="t-subtitle">{subtitle}</p> : null}
      </div>
      {rightSlot ? <div className="t-right">{rightSlot}</div> : null}
    </div>
  );
}
