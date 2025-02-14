'use client';

import dynamic from 'next/dynamic';

const ApprovalPost = dynamic(() => import('@/components/ApprovalPost'), {
  ssr: false // Disable server-side rendering for this component
});

export default function ApprovalsPage() {
  return (
    <div className="min-h-screen">
      <ApprovalPost />
    </div>
  );
}
