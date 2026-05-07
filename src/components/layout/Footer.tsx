import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t py-12 md:py-16">
      <div className="container flex flex-col gap-8 md:flex-row md:justify-between mx-auto px-4 md:px-8">
        <div className="space-y-4">
          <h3 className="font-bold text-lg">AI Spend Audit</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Optimizing startup AI budgets with data-driven insights.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/audit">Start Audit</Link></li>
              <li><Link href="/about">How it works</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#">Privacy</Link></li>
              <li><Link href="#">Terms</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container mt-12 pt-8 border-t mx-auto px-4 md:px-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AI Spend Audit. All rights reserved.
      </div>
    </footer>
  );
}
