import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Download, Share2 } from "lucide-react";

export default function ResultsPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <Link href="/audit" className="text-sm text-muted-foreground hover:text-foreground flex items-center mb-2">
            <ArrowLeft className="mr-1 h-3 w-3" /> Back to Audit
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Audit Results</h1>
          <p className="text-muted-foreground">ID: {params.id}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary uppercase tracking-wider">Potential Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$1,240 / yr</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Current Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-muted-foreground">$4,800 / yr</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Optimized Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-muted-foreground">$3,560 / yr</div>
          </CardContent>
        </Card>
      </div>

      <div className="p-12 border rounded-xl bg-muted/20 flex flex-col items-center justify-center text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Share2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Full analysis coming soon</h3>
        <p className="text-muted-foreground max-w-sm">
          The audit engine is currently under development. This is a preview of how your results will appear.
        </p>
      </div>
    </div>
  );
}
