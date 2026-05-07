export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-3xl">
      <h1 className="text-3xl md:text-5xl font-bold mb-8">About AI Spend Audit</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-lg text-muted-foreground leading-relaxed">
        <p>
          AI Spend Audit was built to help startup founders and CFOs take control of their 
          spiraling AI tool costs. In the rush to adopt AI, many teams have ended up with 
          redundant subscriptions and underutilized seats.
        </p>
        <p>
          Our mission is to provide transparency and actionable data to help you keep 
          your burn rate low without sacrificing the productivity that AI tools provide.
        </p>
        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">How we help</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Detecting overlapping tool capabilities.</li>
          <li>Identifying more cost-effective plan tiers.</li>
          <li>Visualizing annual savings potential.</li>
          <li>Providing market benchmarks for AI spending.</li>
        </ul>
      </div>
    </div>
  );
}
