'use server';

import { dbConnect } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { currentUser } from '@clerk/nextjs/server';
import {
  MetaModelData,
  ModelInfo,
  ModelFrontendConfig,
  ModelApiConfig
} from '@/features/tools/types/schema';
import {
  modelInfoSchema,
  modelApiConfigSchema,
  modelFrontendConfigSchema
} from '@/lib/validation/modelSchema';

export const createProject = async (formData: FormData) => {
  try {
    await dbConnect();
    const user = await currentUser();
    if (!user || !user.id) return { success: false, error: 'Not authorized' };

    const displayName = formData.get('displayName') as string;
    const slug = displayName.toLowerCase().replace(/\s+/g, '-');

    const newProject = await MetaModelData.create({
      modelId: uuidv4(),
      slug,
      displayName,
      authorId: user.id,
      tags: [],
      isPublished: false,
      mode: 'developer'
    });

    return { success: true, project: JSON.parse(JSON.stringify(newProject)) };
  } catch (err) {
    console.error('createProject error:', err);
    return { success: false, error: 'Failed to create project' };
  }
};

export const getProjects = async () => {
  try {
    await dbConnect();
    const user = await currentUser();
    if (!user || !user.id) return { success: false, error: 'Not authorized' };

    const projects = await MetaModelData.find({ authorId: user.id })
      .sort({
        createdAt: -1
      })
      .lean();
    return { success: true, projects: JSON.parse(JSON.stringify(projects)) };
  } catch (err) {
    console.error('getProjects error:', err);
    return { success: false, error: 'Failed to fetch projects' };
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    await dbConnect();
    const user = await currentUser();
    if (!user || !user.id) return { success: false, error: 'Not authorized' };

    const project = await MetaModelData.findOne({ modelId: projectId });
    if (!project || project.authorId !== user.id) {
      return { success: false, error: 'Project not found or unauthorized' };
    }

    await Promise.all([
      MetaModelData.deleteOne({ modelId: projectId }),
      ModelInfo.deleteOne({ modelId: projectId }),
      ModelFrontendConfig.deleteOne({ modelId: projectId }),
      ModelApiConfig.deleteOne({ modelId: projectId })
    ]);

    return { success: true };
  } catch (err) {
    console.error('deleteProject error:', err);
    return { success: false, error: 'Failed to delete project' };
  }
};

export async function saveConfig(data: {
  modelInfo: unknown;
  frontendConfig: unknown;
  apiConfig: unknown;
}) {
  await dbConnect();

  const parsedModelInfo = modelInfoSchema.safeParse(data.modelInfo);
  const parsedFrontendConfig = modelFrontendConfigSchema.safeParse(
    data.frontendConfig
  );
  const parsedApiConfig = modelApiConfigSchema.safeParse(data.apiConfig);

  if (
    !parsedModelInfo.success ||
    !parsedFrontendConfig.success ||
    !parsedApiConfig.success
  ) {
    return {
      success: false,
      errors: {
        modelInfo: parsedModelInfo.error?.format(),
        frontendConfig: parsedFrontendConfig.error?.format(),
        apiConfig: parsedApiConfig.error?.format()
      }
    };
  }

  const { modelId } = parsedModelInfo.data;

  await Promise.all([
    ModelInfo.findOneAndUpdate({ modelId }, parsedModelInfo.data, {
      upsert: true
    }),
    ModelFrontendConfig.findOneAndUpdate(
      { modelId },
      parsedFrontendConfig.data,
      { upsert: true }
    ),
    ModelApiConfig.findOneAndUpdate({ modelId }, parsedApiConfig.data, {
      upsert: true
    })
  ]);

  return { success: true };
}

export async function getConfig(modelId: string) {
  await dbConnect();

  try {
    const [modelInfo, frontendConfig, apiConfig] = await Promise.all([
      ModelInfo.findOne({ modelId }).lean(),
      ModelFrontendConfig.findOne({ modelId }).lean(),
      ModelApiConfig.findOne({ modelId }).lean()
    ]);

    // Check if any of the required configs are missing
    if (!modelInfo || !frontendConfig || !apiConfig) {
      return {
        success: false,
        error: 'Configuration not found',
        missing: {
          modelInfo: !modelInfo,
          frontendConfig: !frontendConfig,
          apiConfig: !apiConfig
        }
      };
    }

    return {
      success: true,
      data: {
        modelInfo,
        frontendConfig,
        apiConfig
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Database error occurred',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function publishModel({
  modelId,
  published = true
}: {
  modelId: string;
  published?: boolean;
}) {
  await dbConnect();
  const user = await currentUser();
  if (!user) throw new Error('Unauthorized');

  const meta = await MetaModelData.findOne({ modelId });
  if (!meta || meta.authorId !== user.id) throw new Error('Access denied');

  meta.isPublished = published;
  await meta.save();

  return { success: true };
}

export async function getPublishedModels() {
  await dbConnect();

  try {
    const models = await MetaModelData.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .lean();

    return { success: true, models: JSON.parse(JSON.stringify(models)) };
  } catch (error) {
    console.error('getPublishedModels error:', error);
    return { success: false, error: 'Failed to fetch published models' };
  }
}

export async function getModelFrontendConfig(modelId: string) {
  await dbConnect();

  try {
    const metaModelData = await MetaModelData.findOne({ modelId }).lean();
    if (!metaModelData) {
      return { success: false, error: 'Model not found' };
    }
    if (!metaModelData.isPublished) {
      return { success: false, error: 'Model not found' };
    }

    const frontendConfig = await ModelFrontendConfig.findOne({
      modelId
    }).lean();
    if (!frontendConfig) {
      return { success: false, error: 'Frontend config not found' };
    }
    const modelInfo = await ModelInfo.findOne({ modelId }).lean();
    if (!modelInfo) {
      return { success: false, error: 'Model info not found' };
    }

    return {
      success: true,
      data: {
        modelInfo,
        metaModelData,
        frontendConfig
      }
    };
  } catch (error) {
    console.error('getModelFrontendConfig error:', error);
    return { success: false, error: 'Failed to fetch model frontend config' };
  }
}

// export async function getModelProxyCall(data){

// }
