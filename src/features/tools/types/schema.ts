// src/models/schemas.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

// Template
type TemplateType = 'default-v1-basic' | 'custom';

// Utility type for mode options
type ModeType = 'public' | 'inviteOnly' | 'developer';

// Define the structure of various document types
export interface IMetaModelData extends Document {
  modelId: string; // UUID
  slug: string;
  displayName: string;
  authorId: string;
  tags: string[];
  isPublished: boolean;
  mode: ModeType;
  createdAt: Date;
  updatedAt: Date;
}

export interface IModelInfo extends Document {
  modelId: string;
  heading: string;
  description: string;
  coverImage?: string;
  author: {
    name: string;
    url?: string;
  };
  template: TemplateType; // Enum value
  docsMarkdown?: string;
  // source: 'frontend' | 'server';
}

// Input field configuration types
export type InputFieldType =
  | 'text'
  | 'textarea'
  | 'slider'
  | 'select'
  | 'checkbox'
  | 'file'
  | 'image'
  | 'video';

export interface InputField {
  name: string;
  type: InputFieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  default?: any;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
  // For select inputs
  options?: Array<{
    value: string;
    label: string;
  }>;
}

// Output configuration types
export type OutputType = 'text' | 'json' | 'image' | 'video' | 'audio' | 'file';

export interface OutputConfig {
  type: OutputType;
  field: string; // JSON path to extract from response
  label?: string;
  transform?: string | null; // Optional JavaScript function as string to transform output
}

export interface IModelFrontendConfig extends Document {
  modelId: string;
  input: InputField[];
  output: OutputConfig;
}

// API configuration types
export interface RequestMapping {
  body?: Record<string, any>;
  query?: Record<string, any>;
  params?: Record<string, any>;
  headers?: Record<string, any>;
}

export interface OutputMapping {
  type: OutputType;
  field: string;
  transform?: string | null;
}

export interface IModelApiConfig extends Document {
  modelId: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  requestMapping: RequestMapping;
  outputMapping: OutputMapping;
}

export interface BlogItem {
  title: string;
  url: string;
  imageUrl?: string;
  description?: string;
  publishedAt?: Date;
}

export interface IModelBlogs extends Document {
  modelId: string;
  blogs: BlogItem[];
}

export interface WeeklyStats {
  weekStart: Date;
  requests: number;
  successes?: number;
  failures?: number;
  avgResponseTime?: number;
}

export interface IModelStats extends Document {
  modelId: string;
  totalRequests: number;
  successfulResponses: number;
  failures: number;
  lastUsed: Date;
  weeklyStats: WeeklyStats[];
  avgResponseTime?: number;
}

// Create the schemas
const MetaModelDataSchema = new Schema<IMetaModelData>(
  {
    modelId: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    displayName: { type: String, required: true },
    authorId: { type: String, required: true },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: false },
    mode: {
      type: String,
      enum: ['public', 'inviteOnly', 'developer'],
      default: 'developer'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const ModelInfoSchema = new Schema<IModelInfo>({
  modelId: {
    type: String,
    ref: 'MetaModelData',
    required: true,
    unique: true,
    index: true
  },
  heading: { type: String, required: true },
  description: { type: String, required: true },
  coverImage: { type: String },
  author: {
    name: { type: String, required: true },
    url: { type: String }
  },
  template: {
    type: String,
    enum: ['default-v1-basic', 'custom'],
    default: 'default-v1-basic'
  },
  docsMarkdown: { type: String }
  // source: {
  //   type: String,
  //   enum: ['frontend', 'server'],
  //   default: 'frontend'
  // }
});

const ModelFrontendConfigSchema = new Schema<IModelFrontendConfig>({
  modelId: {
    type: String,
    ref: 'MetaModelData',
    required: true,
    unique: true,
    index: true
  },
  input: [
    {
      name: { type: String, required: true },
      type: {
        type: String,
        enum: [
          'text',
          'textarea',
          'slider',
          'select',
          'checkbox',
          'file',
          'image',
          'video'
        ],
        required: true
      },
      label: { type: String, required: true },
      placeholder: { type: String },
      required: { type: Boolean, default: false },
      default: { type: Schema.Types.Mixed },
      validation: {
        minLength: { type: Number },
        maxLength: { type: Number },
        min: { type: Number },
        max: { type: Number },
        pattern: { type: String },
        options: [{ type: String }]
      },
      options: [
        {
          value: { type: String },
          label: { type: String }
        }
      ]
    }
  ],
  output: {
    type: {
      type: String,
      enum: ['text', 'json', 'image', 'video', 'audio', 'file'],
      required: true
    },
    field: { type: String, required: true },
    label: { type: String },
    transform: { type: String }
  }
});

const ModelApiConfigSchema = new Schema<IModelApiConfig>({
  modelId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    ref: 'MetaModelData'
  },
  endpoint: { type: String, required: true },
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE'],
    default: 'POST'
  },
  headers: { type: Map, of: String },
  requestMapping: {
    body: { type: Map, of: Schema.Types.Mixed },
    query: { type: Map, of: Schema.Types.Mixed },
    params: { type: Map, of: Schema.Types.Mixed },
    headers: { type: Map, of: Schema.Types.Mixed }
  },
  outputMapping: {
    type: {
      type: String,
      enum: ['text', 'json', 'image', 'video', 'audio', 'file'],
      required: true
    },
    field: { type: String, required: true },
    transform: { type: String }
  }
});

const ModelBlogsSchema = new Schema<IModelBlogs>({
  modelId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    ref: 'MetaModelData'
  },
  blogs: [
    {
      title: { type: String, required: true },
      url: { type: String, required: true },
      imageUrl: { type: String },
      description: { type: String },
      publishedAt: { type: Date }
    }
  ]
});

const ModelStatsSchema = new Schema<IModelStats>({
  modelId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    ref: 'MetaModelData'
  },
  totalRequests: { type: Number, default: 0 },
  successfulResponses: { type: Number, default: 0 },
  failures: { type: Number, default: 0 },
  lastUsed: { type: Date },
  avgResponseTime: { type: Number },
  weeklyStats: [
    {
      weekStart: { type: Date, required: true },
      requests: { type: Number, default: 0 },
      successes: { type: Number, default: 0 },
      failures: { type: Number, default: 0 },
      avgResponseTime: { type: Number }
    }
  ]
});

// Create the models
// We need to handle the case where the model might already be defined in Next.js
// hot-reload environment

// Define a function to ensure model is only created once
function getModel<T extends Document>(
  modelName: string,
  schema: Schema<T>
): Model<T> {
  return mongoose.models[modelName]
    ? (mongoose.model<T>(modelName) as Model<T>)
    : mongoose.model<T>(modelName, schema);
}

// Export models
export const MetaModelData = getModel<IMetaModelData>(
  'MetaModelData',
  MetaModelDataSchema
);
export const ModelInfo = getModel<IModelInfo>('ModelInfo', ModelInfoSchema);
export const ModelFrontendConfig = getModel<IModelFrontendConfig>(
  'ModelFrontendConfig',
  ModelFrontendConfigSchema
);
export const ModelApiConfig = getModel<IModelApiConfig>(
  'ModelApiConfig',
  ModelApiConfigSchema
);
export const ModelBlogs = getModel<IModelBlogs>('ModelBlogs', ModelBlogsSchema);
export const ModelStats = getModel<IModelStats>('ModelStats', ModelStatsSchema);
