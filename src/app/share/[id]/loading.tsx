export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-5xl text-center">
      <div className="h-12 w-64 bg-muted animate-pulse mx-auto mb-8 rounded-lg" />
      <div className="h-24 w-full bg-muted animate-pulse mb-12 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="h-[250px] bg-muted animate-pulse rounded-xl" />
        <div className="h-[250px] bg-muted animate-pulse rounded-xl" />
      </div>
      <div className="space-y-4">
        <div className="h-4 w-full bg-muted animate-pulse rounded" />
        <div className="h-4 w-[90%] bg-muted animate-pulse rounded" />
        <div className="h-4 w-[95%] bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
}
