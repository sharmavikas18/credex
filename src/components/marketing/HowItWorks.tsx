export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Input Your Tools",
      description: "Quickly select the AI tools your team uses and specify the current plan and spend."
    },
    {
      number: "02",
      title: "Run Analysis",
      description: "Our engine compares your usage patterns against market benchmarks and alternative plans."
    },
    {
      number: "03",
      title: "Get Recommendations",
      description: "Receive a detailed report with specific actions to reduce spend while maintaining productivity."
    }
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="md:w-1/3">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How it works</h2>
            <p className="text-muted-foreground leading-relaxed">
              We've simplified the audit process to take less than 5 minutes. 
              No complex integrations required—just transparent data.
            </p>
          </div>
          <div className="md:w-2/3 grid gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6 items-start group">
                <span className="text-4xl font-bold text-muted-foreground/20 group-hover:text-primary/20 transition-colors">
                  {step.number}
                </span>
                <div className="pt-2">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
