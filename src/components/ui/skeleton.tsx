export function LoadingSpinner() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-luxury-bg">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-luxury-accent border-t-transparent" />
    </div>
  );
}