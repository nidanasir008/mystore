export default function Logo({ size = 44 }: { size?: number }) {
  return (
    <img
      src="/uploads/logo_web.png"
      alt="ramiya.pk logo"
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        display: 'block',
        boxShadow: '0 0 0 3px rgba(255,255,255,0.7), 0 6px 20px -6px rgba(139,111,196,0.5)',
      }}
    />
  );
}
