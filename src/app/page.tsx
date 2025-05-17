import { auth } from '@clerk/nextjs/server';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  IconRocket,
  IconBrain,
  IconChartBar,
  IconUsers,
  IconDeviceDesktop
} from '@tabler/icons-react';
import React from 'react';
import { GetStartedButtons } from '@/components/get-started-button';
import { BetaBadge } from '@/components/beta-badge';
import { ClientButton } from '@/components/client-button';
import { FeaturePreviewWrapper } from '@/components/layout/feature-enabled';
import { WAITLIST_FORM } from '@/constants/data';

export default async function Page() {
  const { userId } = await auth();

  return (
    <PageContainer>
      <div className='fflex flex-1 flex-col space-y-2'>
        <section className='relative flex min-h-[100dvh] flex-col items-center justify-center space-y-6 py-16 text-center'>
          <div className='bg-background/60 absolute inset-0 -z-10 backdrop-blur-sm' />
          <div className='absolute inset-0 -z-10 opacity-20'>
            <div className='animate-blob bg-primary/40 absolute top-0 left-0 h-64 w-64 rounded-full blur-3xl' />
            <div className='animation-delay-2000 animate-blob bg-secondary/40 absolute top-0 right-0 h-64 w-64 rounded-full blur-3xl' />
            <div className='animation-delay-4000 animate-blob bg-accent/40 absolute bottom-0 left-0 h-64 w-64 rounded-full blur-3xl' />
          </div>

          <BetaBadge />
          <h1 className='bg-gradient-to-r from-purple-500 via-pink-500 to-purple-700 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-6xl lg:text-7xl'>
            AIonica
          </h1>
          <p className='text-muted-foreground max-w-2xl text-lg md:text-xl'>
            The missing link between your AI investments and actual productivity
          </p>

          <GetStartedButtons userId={userId} />
          <FeaturePreviewWrapper feature={'USER_DEVELOPER_MODE'}>
            <ClientButton
              href='/demo'
              variant='outline'
              text='View Interactive Demo'
              icon='demo'
            />
          </FeaturePreviewWrapper>
        </section>

        <section className='border-border bg-card rounded-xl border px-4 py-16 shadow-sm md:px-8'>
          <div className='mx-auto max-w-5xl text-center'>
            <h2 className='mb-4 text-3xl font-bold'>
              10x Faster Implementation
            </h2>
            <p className='text-muted-foreground mx-auto mb-12 max-w-2xl'>
              Our clients report dramatic improvements after switching to our
              unified interface
            </p>

            <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
              {[
                {
                  icon: IconRocket,
                  title: 'Quick Integration',
                  desc: 'Connect your AI models and APIs with our platform in minutes, not weeks'
                },
                {
                  icon: IconBrain,
                  title: 'Unified Interface',
                  desc: 'One platform to manage all your AI implementations and interactions'
                },
                {
                  icon: IconChartBar,
                  title: 'Enhanced Productivity',
                  desc: 'Make your AI accessible to all stakeholders, maximizing your investment'
                }
              ].map(({ icon: Icon, title, desc }, idx) => (
                <Card key={idx} className='text-left'>
                  <CardHeader className='pb-2'>
                    <div className='bg-primary/10 mb-4 flex h-14 w-14 items-center justify-center rounded-full p-3'>
                      <Icon className='text-primary h-8 w-8' />
                    </div>
                    <CardTitle className='text-xl'>{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-muted-foreground'>{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className='bg-accent/5 my-12 rounded-xl px-4 py-12 md:px-8'>
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
        </section>

        <section className='my-8 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-16 text-white shadow-lg hover:from-blue-700 hover:to-purple-700 md:px-8'>
          <div className='mx-auto max-w-4xl text-center'>
            <h2 className='mb-4 text-3xl font-bold'>
              Ready to revolutionize your AI workflow?
            </h2>
            <p className='text-primary-foreground/90 mx-auto mb-8 max-w-2xl text-lg'>
              Join thousands of organizations already benefiting from our
              platform. Early access applications are now open.
            </p>
            <ClientButton
              text='Apply for Beta Access'
              href={WAITLIST_FORM}
              variant='secondary'
              size='lg'
            />
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
