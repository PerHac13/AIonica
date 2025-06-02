import { z } from 'zod';

export const modelInfoSchema = z.object({
  modelId: z.string().min(1),
  heading: z.string().min(1),
  description: z.string().min(1),
  coverImage: z.string().optional(),
  author: z.object({
    name: z.string().min(1),
    url: z.string().url().optional()
  }),
  template: z.enum(['default-v1-basic', 'custom']),
  docsMarkdown: z.string().optional()
});

const inputFieldSchema = z.object({
  name: z.string().min(1),
  type: z.enum([
    'text',
    'textarea',
    'slider',
    'select',
    'checkbox',
    'file',
    'image',
    'video'
  ]),
  label: z.string().min(1),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  default: z.any().optional(),
  validation: z
    .object({
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      pattern: z.string().optional(),
      options: z.array(z.string()).optional()
    })
    .optional(),
  options: z
    .array(
      z.object({
        value: z.string(),
        label: z.string()
      })
    )
    .optional()
});

export const modelFrontendConfigSchema = z.object({
  modelId: z.string().min(1),
  input: z.array(inputFieldSchema),
  output: z.object({
    type: z.enum(['text', 'json', 'image', 'video', 'audio', 'file']),
    field: z.string().min(1),
    label: z.string().optional(),
    transform: z.string().optional()
  })
});

export const modelApiConfigSchema = z.object({
  modelId: z.string().min(1),
  endpoint: z.string().url(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
  headers: z.record(z.string()).optional(),
  requestMapping: z
    .object({
      body: z.record(z.any()).optional(),
      query: z.record(z.any()).optional(),
      params: z.record(z.any()).optional(),
      headers: z.record(z.any()).optional()
    })
    .optional(),
  outputMapping: z.object({
    type: z.enum(['text', 'json', 'image', 'video', 'audio', 'file']),
    field: z.string(),
    transform: z.string().optional()
  })
});
