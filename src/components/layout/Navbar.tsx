import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight">AI Spend Audit</span>
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              About
            </Link>
            <Link href="/audit" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Start Audit
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <Link href="/audit">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
          
          <Sheet>
            <SheetTrigger
              className="md:hidden"
              render={<Button variant="ghost" size="icon" />}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle>Menu</SheetTitle>
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-semibold">Home</Link>
                <Link href="/about" className="text-lg font-semibold">About</Link>
                <Link href="/audit" className="text-lg font-semibold">Start Audit</Link>
                <Link href="/audit" className="mt-4">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
