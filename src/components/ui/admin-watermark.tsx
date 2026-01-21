import { usePermissions } from '@/hooks/usePermissions';

export function AdminWatermark() {
  const { isAdmin, isSuperAdmin } = usePermissions();

  // Only show watermark for admins (not super admins)
  if (!isAdmin || isSuperAdmin) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-1.5">
        <span className="text-xs font-medium text-blue-400">Admin View</span>
      </div>
    </div>
  );
}
