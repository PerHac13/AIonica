'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  createProject,
  getProjects,
  deleteProject
} from '@/features/developer-mode/action/modelAction';
import { Trash2 } from 'lucide-react';
import { IMetaModelData } from '@/features/tools/types/schema';

export function MyToolSectionView() {
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState<IMetaModelData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const router = useRouter();

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Function to fetch projects
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getProjects();

      if (result.success) {
        setProjects(result?.projects || []);
      } else {
        setError(result.error || 'Failed to fetch projects');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (projectName.trim() === '') return;

    setIsCreating(true);
    setError(null);

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('displayName', projectName);

      // Call the server action
      const result = await createProject(formData);

      if (result.success) {
        // Clear input and refresh projects
        setProjectName('');
        fetchProjects();
      } else {
        setError(result.error || 'Failed to create project');
      }
    } catch (err) {
      console.error('Failed to create project:', err);
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/developer-mode/tool/${projectId}`);
  };

  const handleDeleteClick = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation(); // Prevent navigation when clicking delete

    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const result = await deleteProject(projectId);

      if (result.success) {
        // Refresh the projects list
        fetchProjects();
      } else {
        setError(result.error || 'Failed to delete project');
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    }
  };

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>My Projects</h1>
        <div className='flex gap-2'>
          <Input
            placeholder='Project name'
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className='w-64'
          />
          <Button
            onClick={handleCreateProject}
            disabled={isCreating || projectName.trim() === ''}
          >
            {isCreating ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant='destructive' className='mb-4'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className='flex justify-center p-8'>
          <div className='h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-gray-900'></div>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {projects && projects.length > 0 ? (
            projects.map((project: IMetaModelData) => (
              <Card
                key={project.modelId}
                className='cursor-pointer transition-shadow hover:shadow-md'
                onClick={() => handleProjectClick(project.modelId)}
              >
                <CardHeader className='flex items-center justify-between pb-2'>
                  <CardTitle>{project.displayName}</CardTitle>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={(e) => handleDeleteClick(e, project.modelId)}
                    className='h-8 w-8 p-0'
                  >
                    <Trash2 className='h-4 w-4 text-gray-500 hover:text-red-500' />
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-gray-500'>
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                  <div className='mt-2 flex flex-wrap gap-1'>
                    {project.tags &&
                      project.tags.map((tag) => (
                        <span
                          key={tag}
                          className='rounded-full bg-gray-100 px-2 py-1 text-xs'
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className='col-span-full rounded-lg bg-gray-50 p-8 text-center'>
              <p className='text-gray-500'>
                No projects found. Create your first project!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
