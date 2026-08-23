export function MapEmbed({ address, className }: { address: string; className?: string }) {
  const query = encodeURIComponent(address);

  return (
    <div className={className}>
      <iframe
        title={`Map showing ${address}`}
        src={`https://www.google.com/maps?q=${query}&output=embed`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full"
      />
    </div>
  );
}
