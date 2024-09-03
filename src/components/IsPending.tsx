export default function IsPending() {
  return (
    <>
      <div className="w-full h-80 mt-4 animate-pulse bg-gray-100" />
      <div className="mt-8 h-full w-full space-y-6">
        <div className="h-14 w-full bg-gray-100 animate-pulse"></div>
        <div className="h-14 w-full bg-gray-100 animate-pulse"></div>
        <div className="h-14 w-full bg-gray-100 animate-pulse"></div>
        <div className="h-14 w-full bg-gray-100 animate-pulse"></div>
        <div className="h-14 w-full bg-gray-100 animate-pulse"></div>
      </div>
    </>
  );
}
