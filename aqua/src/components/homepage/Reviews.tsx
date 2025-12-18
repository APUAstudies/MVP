import { Card } from "../../components/ui/Cards";

const REVIEW_DATA = [
  { subtitle: "Computer Science Student", content: "The Cornell Note editor is a game changer. I stopped using physical notebooks entirely.", footer: "@alex_codes" },
  { subtitle: "Freelance Designer", content: "The Pomodoro timer being baked into my notes keeps me in the flow state longer.", footer: "@design_jess" },
  { subtitle: "Bar Student", content: "Group accountability is exactly what I needed for the long study nights.", footer: "@lawyer_to_be" }
];

export const Reviews = () => (
  <section className="py-24 px-6 border-y border-[var(--border-color)] bg-[var(--bg-sidebar)]">
    <div className="max-w-7xl mx-auto text-center mb-16">
      <h2 className="text-3xl font-bold mb-4">Loved by over 10,000 students</h2>
      <p className="text-[var(--text-muted)]">See how others are boosting their focus with APUA.</p>
    </div>
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {REVIEW_DATA.map((review, i) => (
        <Card key={i} type="review" {...review} />
      ))}
    </div>
  </section>
);