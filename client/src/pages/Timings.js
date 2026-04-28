const weekday = [
  "05:30 AM - First train starts",
  "08:00 AM - Peak frequency every 4-6 minutes",
  "11:30 PM - Last train from terminal stations",
];

const sunday = [
  "06:00 AM - First train starts",
  "09:00 AM - Regular frequency every 8-10 minutes",
  "11:00 PM - Last train from terminal stations",
];

export default function Timings() {
  return (
    <section className="grid grid-2">
      <div className="card">
        <h2>Delhi Metro Weekday Timings</h2>
        {weekday.map((item) => (
          <p key={item} className="muted">
            {item}
          </p>
        ))}
      </div>
      <div className="card">
        <h2>Delhi Metro Sunday Timings</h2>
        {sunday.map((item) => (
          <p key={item} className="muted">
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}
