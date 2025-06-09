export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-zinc-900 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-zinc-300 text-lg">Loading...</p>
      </div>
    </div>
  );
}
