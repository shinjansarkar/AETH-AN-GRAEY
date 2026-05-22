export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: 'var(--off-white)', minHeight: '100vh' }}>
      {children}
    </div>
  );
}
