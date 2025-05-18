import { FeaturePreviewWrapper } from '@/components/layout/feature-enabled';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  IconCode,
  IconTools,
  IconDeviceDesktop,
  IconUsers
} from '@tabler/icons-react';
import React from 'react';

export default function AIonicaLandingPage({
  blogs_section
}: {
  blogs_section: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        {/* Hero Section */}
        <div className='flex h-[90dvh] flex-col items-center justify-center space-y-6 py-16 text-center'>
          <h1 className='from-primary bg-gradient-to-r to-blue-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl lg:text-6xl'>
            AIonica
          </h1>
          <p className='text-muted-foreground max-w-3xl text-xl md:text-2xl'>
            The missing link between your AI investments and actual productivity
          </p>
        </div>

        {/* For Whom Section */}
        <div className='bg-muted/30 my-12 rounded-xl px-4 py-12 md:px-8'>
          <div className='mx-auto max-w-5xl text-center'>
            <h2 className='mb-4 text-3xl font-bold'>Who We Help</h2>
            <p className='text-muted-foreground mx-auto mb-12 max-w-2xl'>
              Tailored solutions for organizations across various industries
            </p>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {[
                {
                  icon: IconUsers,
                  title: 'Students with AI Models',
                  desc: 'We assist students who’ve built AI models but lack a frontend by providing tools to easily create interactive web interfaces — no frontend experience required.',
                  bg: 'bg-primary/5',
                  iconBg: 'bg-primary/10',
                  iconColor: 'text-primary'
                },
                {
                  icon: IconDeviceDesktop,
                  title: 'Open-Source AI Projects',
                  desc: 'Open-source developers can use our platform to turn their AI APIs into user-friendly products, making advanced models accessible to a wider audience.',
                  bg: 'bg-primary/5',
                  iconBg: 'bg-primary/10',
                  iconColor: 'text-primary'
                }
              ].map(
                ({ icon: Icon, title, desc, bg, iconBg, iconColor }, idx) => (
                  <Card key={idx} className={`overflow-hidden ${bg}`}>
                    <CardHeader>
                      <div className='mb-4 flex items-center gap-4'>
                        <div className={`${iconBg} rounded-full p-2`}>
                          <Icon className={`${iconColor} h-6 w-6`} />
                        </div>
                        <CardTitle>{title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className='text-muted-foreground'>{desc}</p>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </div>
        </div>

        {/* Features Cards */}
        <div className='py-12'>
          <div className='mx-auto max-w-5xl text-center'>
            <h2 className='mb-4 text-3xl font-bold'>Upcoming Features</h2>
            <p className='text-muted-foreground mx-auto mb-12 max-w-2xl'>
              Well, AIonica is in development, but we are working hard to bring
              you the best features. Here are some of the upcoming features we
              are working on:
            </p>
          </div>
          <div className='mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2'>
            <FeaturePreviewWrapper feature={'USER_DEVELOPER_MODE'}>
              <Card className='border-primary/20 hover:border-primary/50 border-2 transition-all'>
                <CardHeader className='pb-2'>
                  <CardTitle className='flex items-center gap-2'>
                    <IconTools className='h-6 w-6' />
                    AI Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>
                    Explore our complete suite of AI implementation tools
                    designed for students and non-profits.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className='w-full'>Go to Playground</Button>
                </CardFooter>
              </Card>
            </FeaturePreviewWrapper>
            <FeaturePreviewWrapper feature={'USER_DEVELOPER_MODE'}>
              <Card className='border-primary/20 hover:border-primary/50 border-2 transition-all'>
                <CardHeader className='pb-2'>
                  <CardTitle className='flex items-center gap-2'>
                    <IconCode className='h-6 w-6' />
                    Developer Mode
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>
                    Access advanced settings, API documentation, and developer
                    resources for custom implementations.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant='outline' className='w-full'>
                    Switch to Developer Mode
                  </Button>
                </CardFooter>
              </Card>
            </FeaturePreviewWrapper>
          </div>
        </div>

        {/* Blog Section */}
        <div className='py-12'>
          <h2 className='mb-8 text-3xl font-bold'>Latest Insights</h2>
          <div>{blogs_section}</div>
        </div>
      </div>
    </PageContainer>
  );
}
