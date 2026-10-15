export default function Chips({ id, label, items, active, onPick }) {
  return (
    <div className="chips" id={id} role="group" aria-label={label}>
      {items.map((x) => (
        <button
          key={x}
          className="chip"
          aria-pressed={active === x}
          onClick={() => onPick(x)}
        >
          {x}
        </button>
      ))}
    </div>
  );
}
