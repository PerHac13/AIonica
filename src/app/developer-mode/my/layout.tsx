import PageContainer from '@/components/layout/page-container';

import React from 'react';

export default function AIonicaLandingPage({
  blogs_section,
  my_tools_section
}: {
  blogs_section: React.ReactNode;
  my_tools_section: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        {/* My Tools Section */}
        <div className='py-12'>{my_tools_section}</div>

        {/* Blog Section */}
        <div className='py-12'>
          <h2 className='mb-8 text-3xl font-bold'>Latest Insights</h2>
          <div>{blogs_section}</div>
        </div>
      </div>
    </PageContainer>
  );
}
