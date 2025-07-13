'use client';

import { useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
  saveConfig,
  publishModel,
  getConfig
} from '@/features/developer-mode/action/modelAction';
import {
  modelInfoSchema,
  modelFrontendConfigSchema,
  modelApiConfigSchema
} from '@/lib/validation/modelSchema';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Globe, Copy, Check } from 'lucide-react';

interface EditorClientProps {
  modelId: string;
  initialData?: {
    isPublished: boolean;
    url?: string;
  };
}

export default function EditorClient({
  modelId,
  initialData = { isPublished: false }
}: EditorClientProps) {
  const [jsonString, setJsonString] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublished, setIsPublished] = useState(initialData.isPublished);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState(
    initialData.url || `${window.location.origin}/model/${modelId}`
  );

  const popoverRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const loadConfig = async () => {
      if (!modelId) return;

      try {
        // Try to get existing config
        const result = await getConfig(modelId);

        if (result.success && result.data) {
          // Config found, use existing data
          const configData = {
            modelInfo: result.data.modelInfo,
            frontendConfig: result.data.frontendConfig,
            apiConfig: result.data.apiConfig
          };
          setJsonString(JSON.stringify(configData, null, 2));
        } else {
          // Config not found, use default values
          const defaultJson = {
            modelInfo: {
              modelId,
              heading: '',
              description: '',
              author: { name: '' },
              template: 'default-v1-basic'
            },
            frontendConfig: {
              modelId,
              input: [],
              output: {
                type: 'text',
                field: ''
              }
            },
            apiConfig: {
              modelId,
              endpoint: '',
              method: 'POST',
              requestMapping: {},
              outputMapping: {
                type: 'text',
                field: ''
              }
            }
          };
          setJsonString(JSON.stringify(defaultJson, null, 2));
        }
      } catch (error) {
        console.error('Error loading config:', error);

        // On error, fall back to default values
        const defaultJson = {
          modelInfo: {
            modelId,
            heading: '',
            description: '',
            author: { name: '' },
            template: 'default-v1-basic'
          },
          frontendConfig: {
            modelId,
            input: [],
            output: {
              type: 'text',
              field: ''
            }
          },
          apiConfig: {
            modelId,
            endpoint: '',
            method: 'POST',
            requestMapping: {},
            outputMapping: {
              type: 'text',
              field: ''
            }
          }
        };
        setJsonString(JSON.stringify(defaultJson, null, 2));
      }
    };

    loadConfig();
  }, [modelId]);

  const handleSave = async () => {
    try {
      const parsed = JSON.parse(jsonString);

      const modelInfoValid = modelInfoSchema.safeParse(parsed.modelInfo);
      const frontendConfigValid = modelFrontendConfigSchema.safeParse(
        parsed.frontendConfig
      );
      const apiConfigValid = modelApiConfigSchema.safeParse(parsed.apiConfig);

      if (
        !modelInfoValid.success ||
        !frontendConfigValid.success ||
        !apiConfigValid.success
      ) {
        setError('Validation failed. Please check the structure.');
        return;
      }

      setIsSubmitting(true);
      const result = await saveConfig(parsed);
      setIsSubmitting(false);

      if (result.success) {
        setSuccessMessage('Config saved!');
        setError(null);
      } else {
        setError('Save failed.');
      }
    } catch {
      setError('Invalid JSON.');
    }
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      const result = await publishModel({ modelId });
      if (result.success) {
        setIsPublished(true);
        setSuccessMessage('Model published successfully!');
        setError(null);
      } else {
        setError('Publish failed.');
      }
    } catch (err) {
      setError('Publish failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnpublish = async () => {
    setIsSubmitting(true);
    try {
      const result = await publishModel({ modelId, published: false });
      if (result.success) {
        setIsPublished(true);
        setSuccessMessage('Model unpublished successfully!');
        setError(null);
      } else {
        setError('Unpublish failed.');
      }
    } catch (err) {
      setError('Unpublish failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy URL.');
    }
  };

  return (
    <div className='space-y-4'>
      {/* Header with Publish Button */}
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Model Configuration</h2>

        <Popover>
          <PopoverTrigger asChild>
            <Button size='sm' variant='ghost' ref={popoverRef}>
              Publish
              {isPublished && <Globe className='ml-2 h-4 w-4 text-sky-500' />}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className='w-72'
            align='end'
            alignOffset={8}
            forceMount
          >
            {isPublished ? (
              <div className='space-y-4'>
                <div className='flex items-center gap-x-2'>
                  <Globe className='h-4 w-4 animate-pulse text-sky-500' />
                  <p className='text-xs font-medium text-sky-500'>
                    This model is live on web.
                  </p>
                </div>
                <div className='flex items-center'>
                  <input
                    className='bg-muted h-8 flex-1 truncate rounded-l-md border px-2 text-xs'
                    value={url}
                    disabled
                  />
                  <Button
                    onClick={handleCopy}
                    disabled={copied}
                    className='h-8 rounded-l-none'
                  >
                    {copied ? (
                      <Check className='h-4 w-4' />
                    ) : (
                      <Copy className='h-4 w-4' />
                    )}
                  </Button>
                </div>
                <Button
                  size='sm'
                  className='w-full text-xs'
                  disabled={isSubmitting}
                  onClick={handleUnpublish}
                >
                  Unpublish
                </Button>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center'>
                <Globe className='text-muted-foreground mb-2 h-8 w-8' />
                <p className='mb-2 text-sm font-medium'>Publish this model</p>
                <span className='text-muted-foreground mb-4 text-xs'>
                  Share your model with others.
                </span>
                <Button
                  disabled={isSubmitting}
                  onClick={handlePublish}
                  className='w-full text-xs'
                  size='sm'
                >
                  Publish
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Editor */}
      <Editor
        height='500px'
        defaultLanguage='json'
        value={jsonString}
        onChange={(value) => setJsonString(value || '')}
        theme='vs-dark'
        options={{
          minimap: { enabled: false },
          fontSize: 14
        }}
      />

      {/* Messages */}
      {error && <div className='text-red-600'>{error}</div>}
      {successMessage && <div className='text-green-600'>{successMessage}</div>}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSubmitting}
        className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50'
      >
        {isSubmitting ? 'Saving...' : 'Save Config'}
      </button>
    </div>
  );
}
