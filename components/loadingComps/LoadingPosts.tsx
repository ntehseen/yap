function LoadingPosts() {
  return (
    <div className="w-full space-y-0">
      {[0, 1, 2].map((key) => (
        <div key={key} className="border-b border-border px-4 py-4">
          <div className="flex gap-3">
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-muted" />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="h-4 w-40 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-48 w-full animate-pulse rounded-2xl bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingPosts;
