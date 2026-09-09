import React from 'react';
import AssessmentHeader from '@/components/assessment/AssessmentHeader';

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--cream)]">
      <AssessmentHeader />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
