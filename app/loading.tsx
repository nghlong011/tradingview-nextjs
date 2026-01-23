export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-foreground/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-foreground rounded-full animate-spin"></div>
        </div>
        
        {/* Loading text */}
        <p className="text-foreground/60 text-sm font-medium animate-pulse">
          Đang tải...
        </p>
      </div>
    </div>
  );
}
