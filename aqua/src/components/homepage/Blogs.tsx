import { Card } from "../../components/ui/Cards";

const BLOG_DATA = [
  { title: "The Cornell Method Explained", content: "Learn why this 1940s note-taking system is still the king of retention.", footer: "5 min read", image: "https://picsum.photos/400/250?v=1" },
  { title: "Beating Burnout", content: "Strategies for high-performers to maintain velocity without crashing.", footer: "8 min read", image: "https://picsum.photos/400/250?v=2" },
  { title: "Notion Workflow Sync", content: "How to automate your APUA notes directly into your Notion workspace.", footer: "3 min read", image: "https://picsum.photos/400/250?v=3" }
];

export const Blogs = () => (
  <section className="py-24 px-6 bg-[var(--bg-main)]">
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-3xl font-bold">Latest from the blog</h2>
        <button className="text-[var(--primary)] text-sm font-bold hover:underline">View all posts →</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOG_DATA.map((post, i) => (
          <Card key={i} type="blog" {...post} />
        ))}
      </div>
    </div>
  </section>
);