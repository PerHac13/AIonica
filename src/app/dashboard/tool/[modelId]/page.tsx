// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, notFound } from 'next/navigation';
// import Image from 'next/image';
// // import ReactMarkdown from 'react-markdown';
// import { Loader2, Search, ExternalLink, ChevronDown, Info } from 'lucide-react';
// import { getModelFrontendConfig } from '@/features/developer-mode/action/modelAction';

// // Types
// interface ModelInfo {
//   modelId: string;
//   heading: string;
//   description: string;
//   coverImage: string;
//   author: {
//     name: string;
//     url: string;
//   };
//   docsMarkdown: string;
//   template: string;
// }

// interface ValidationRule {
//   minLength?: number;
//   maxLength?: number;
//   min?: number;
//   max?: number;
//   pattern?: string;
//   options: any[];
// }

// interface InputField {
//   name: string;
//   type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea';
//   label: string;
//   placeholder?: string;
//   required: boolean;
//   default?: any;
//   validation?: ValidationRule;
//   options?: Array<{ value: string; label: string }>;
// }

// interface ModelFrontendConfig {
//   modelId: string;
//   input: InputField[];
//   output: {
//     type: string;
//     field: string;
//     label: string;
//     transform?: string;
//   };
// }

// interface MetaModelData {
//   modelId: string;
//   slug: string;
//   displayName: string;
//   isPublished: boolean;
//   mode: string;
//   tags: string[];
// }

// interface ModelData {
//   modelInfo: ModelInfo;
//   frontendConfig: ModelFrontendConfig;
//   metaModelData: MetaModelData;
// }

// export default function ModelPlaygroundPage() {
//   const params = useParams();
//   const slug = params.modelId as string;

//   const [modelData, setModelData] = useState<ModelData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [formData, setFormData] = useState<Record<string, any>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [result, setResult] = useState<any>(null);
//   const [showDocs, setShowDocs] = useState(false);

//   // Fetch model configuration
//   useEffect(() => {
//     async function fetchModelData() {
//       try {
//         const response = await getModelFrontendConfig(slug);
//         const data = response;
//         console.log('Model data:', data);

//         if (!data.success) {
//           setError(data.error || 'Model not found');
//           return;
//         }

//         setModelData(data.data);

//         // Initialize form with default values
//         const defaults: Record<string, any> = {};
//         data.data.frontendConfig.input.forEach((field: InputField) => {
//           if (field.default !== undefined) {
//             defaults[field.name] = field.default;
//           } else if (field.type === 'checkbox') {
//             defaults[field.name] = false;
//           } else if (field.type === 'number') {
//             defaults[field.name] = 0;
//           } else {
//             defaults[field.name] = '';
//           }
//         });
//         setFormData(defaults);
//       } catch (err) {
//         setError('Failed to load model configuration');
//         console.error('Error fetching model data:', err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchModelData();
//   }, [slug]);

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setResult(null);

//     try {
//       // Call your getProxyModel action here
//       const response = await fetch('/api/proxy-model', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           modelId: modelData?.modelInfo.modelId,
//           input: formData
//         })
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to process request');
//       }

//       // Apply transform if exists
//       if (modelData?.frontendConfig.output.transform) {
//         try {
//           const transformFn = new Function(
//             'data',
//             modelData.frontendConfig.output.transform
//           );
//           setResult(transformFn(data));
//         } catch (err) {
//           setResult(data);
//         }
//       } else {
//         setResult(data);
//       }
//     } catch (err) {
//       console.error('Error calling model:', err);
//       setResult({
//         error: err instanceof Error ? err.message : 'An error occurred'
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle input changes
//   const handleInputChange = (name: string, value: any) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Render different input types
//   const renderInput = (field: InputField) => {
//     const baseClasses =
//       'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';

//     switch (field.type) {
//       case 'text':
//       case 'number':
//         return (
//           <input
//             type={field.type}
//             id={field.name}
//             name={field.name}
//             value={formData[field.name] || ''}
//             onChange={(e) =>
//               handleInputChange(
//                 field.name,
//                 field.type === 'number'
//                   ? Number(e.target.value)
//                   : e.target.value
//               )
//             }
//             placeholder={field.placeholder}
//             required={field.required}
//             className={baseClasses}
//             min={field.validation?.min}
//             max={field.validation?.max}
//             minLength={field.validation?.minLength}
//             maxLength={field.validation?.maxLength}
//           />
//         );

//       case 'textarea':
//         return (
//           <textarea
//             id={field.name}
//             name={field.name}
//             value={formData[field.name] || ''}
//             onChange={(e) => handleInputChange(field.name, e.target.value)}
//             placeholder={field.placeholder}
//             required={field.required}
//             className={`${baseClasses} min-h-[120px] resize-y`}
//             minLength={field.validation?.minLength}
//             maxLength={field.validation?.maxLength}
//           />
//         );

//       case 'select':
//         return (
//           <div className='relative'>
//             <select
//               id={field.name}
//               name={field.name}
//               value={formData[field.name] || ''}
//               onChange={(e) => handleInputChange(field.name, e.target.value)}
//               required={field.required}
//               className={`${baseClasses} appearance-none pr-10`}
//             >
//               <option value=''>Select an option</option>
//               {field.options?.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             <ChevronDown className='pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
//           </div>
//         );

//       case 'checkbox':
//         return (
//           <label className='flex cursor-pointer items-center space-x-3'>
//             <input
//               type='checkbox'
//               id={field.name}
//               name={field.name}
//               checked={formData[field.name] || false}
//               onChange={(e) => handleInputChange(field.name, e.target.checked)}
//               className='h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
//             />
//             <span className='text-gray-700'>{field.label}</span>
//           </label>
//         );

//       default:
//         return null;
//     }
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className='flex min-h-screen items-center justify-center bg-gray-50'>
//         <div className='text-center'>
//           <Loader2 className='mx-auto mb-4 h-12 w-12 animate-spin text-blue-600' />
//           <p className='text-gray-600'>Loading model configuration...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error || !modelData) {
//     notFound();
//   }

//   const { modelInfo, frontendConfig, metaModelData } = modelData;

//   return (
//     <div className='min-h-screen bg-gray-50'>
//       {/* Hero Section */}
//       <div className='relative h-80 overflow-hidden'>
//         <Image
//           src={modelInfo.coverImage}
//           alt={modelInfo.heading}
//           fill
//           className='object-cover'
//           priority
//         />
//         <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent' />
//         <div className='absolute right-0 bottom-0 left-0 p-8'>
//           <div className='mx-auto max-w-6xl'>
//             <h1 className='mb-2 text-4xl font-bold text-white'>
//               {modelInfo.heading}
//             </h1>
//             <p className='mb-4 text-lg text-gray-200'>
//               {modelInfo.description}
//             </p>
//             <div className='flex items-center space-x-4'>
//               <span className='text-sm text-gray-300'>by</span>
//               <a
//                 href={modelInfo.author.url}
//                 target='_blank'
//                 rel='noopener noreferrer'
//                 className='flex items-center space-x-2 text-white transition-colors hover:text-blue-300'
//               >
//                 <span>{modelInfo.author.name}</span>
//                 <ExternalLink className='h-4 w-4' />
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className='mx-auto max-w-6xl px-4 py-8'>
//         <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
//           {/* Input Form */}
//           <div className='lg:col-span-1'>
//             <div className='rounded-xl bg-white p-6 shadow-lg'>
//               <h2 className='mb-6 text-xl font-semibold text-gray-800'>
//                 Input Parameters
//               </h2>
//               <form onSubmit={handleSubmit} className='space-y-6'>
//                 {frontendConfig.input.map((field) => (
//                   <div key={field.name} className='space-y-2'>
//                     {field.type !== 'checkbox' && (
//                       <label
//                         htmlFor={field.name}
//                         className='block text-sm font-medium text-gray-700'
//                       >
//                         {field.label}
//                         {field.required && (
//                           <span className='ml-1 text-red-500'>*</span>
//                         )}
//                       </label>
//                     )}
//                     {renderInput(field)}
//                     {field.validation?.maxLength && (
//                       <p className='text-xs text-gray-500'>
//                         Max {field.validation.maxLength} characters
//                       </p>
//                     )}
//                   </div>
//                 ))}

//                 <button
//                   type='submit'
//                   disabled={isSubmitting}
//                   className='flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400'
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <Loader2 className='h-5 w-5 animate-spin' />
//                       <span>Processing...</span>
//                     </>
//                   ) : (
//                     <>
//                       <Search className='h-5 w-5' />
//                       <span>Run Model</span>
//                     </>
//                   )}
//                 </button>
//               </form>
//             </div>

//             {/* Documentation Toggle */}
//             <button
//               onClick={() => setShowDocs(!showDocs)}
//               className='mt-6 flex w-full items-center justify-center space-x-2 rounded-lg bg-gray-100 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200'
//             >
//               <Info className='h-5 w-5' />
//               <span>{showDocs ? 'Hide' : 'Show'} Documentation</span>
//             </button>
//           </div>

//           {/* Results Section */}
//           <div className='lg:col-span-2'>
//             <div className='min-h-[400px] rounded-xl bg-white p-6 shadow-lg'>
//               <h2 className='mb-6 text-xl font-semibold text-gray-800'>
//                 {frontendConfig.output.label || 'Results'}
//               </h2>

//               {!result && !isSubmitting && (
//                 <div className='py-12 text-center'>
//                   <Search className='mx-auto mb-4 h-16 w-16 text-gray-300' />
//                   <p className='text-gray-500'>Run the model to see results</p>
//                 </div>
//               )}

//               {isSubmitting && (
//                 <div className='py-12 text-center'>
//                   <Loader2 className='mx-auto mb-4 h-12 w-12 animate-spin text-blue-600' />
//                   <p className='text-gray-600'>Processing your request...</p>
//                 </div>
//               )}

//               {result && (
//                 <div className='space-y-4'>
//                   {result.error ? (
//                     <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
//                       <p className='font-medium text-red-700'>Error</p>
//                       <p className='mt-1 text-red-600'>{result.error}</p>
//                     </div>
//                   ) : (
//                     <div className='prose prose-sm max-w-none'>
//                       {/* Render based on output type */}
//                       {frontendConfig.output.type === 'json' ? (
//                         <div className='overflow-auto rounded-lg bg-gray-50 p-4'>
//                           <pre className='text-sm'>
//                             {JSON.stringify(result, null, 2)}
//                           </pre>
//                         </div>
//                       ) : frontendConfig.output.type === 'html' ? (
//                         <div
//                           dangerouslySetInnerHTML={{ __html: result }}
//                           className='space-y-4'
//                         />
//                       ) : frontendConfig.output.type === 'markdown' ? (
//                         // <ReactMarkdown className='space-y-4'>
//                         //   {result}
//                         // </ReactMarkdown>
//                         <></>
//                       ) : (
//                         <div className='space-y-4'>
//                           {/* Custom rendering for specific models like DuckDuckGo */}
//                           {renderCustomOutput(result)}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Documentation Section */}
//         {/* {showDocs && modelInfo.docsMarkdown && (
//           <div className='mt-8 rounded-xl bg-white p-8 shadow-lg'>
//             <div className='prose prose-lg max-w-none'>
//               <ReactMarkdown
//                 components={{
//                   pre: ({ node, ...props }) => (
//                     <pre
//                       className='overflow-x-auto rounded-lg bg-gray-900 p-4 text-gray-100'
//                       {...props}
//                     />
//                   ),
//                   code: ({ node, inline, ...props }) =>
//                     inline ? (
//                       <code
//                         className='rounded bg-gray-100 px-1 py-0.5 text-sm'
//                         {...props}
//                       />
//                     ) : (
//                       <code {...props} />
//                     ),
//                   h1: ({ node, ...props }) => (
//                     <h1
//                       className='mb-4 text-3xl font-bold text-gray-900'
//                       {...props}
//                     />
//                   ),
//                   h2: ({ node, ...props }) => (
//                     <h2
//                       className='mt-8 mb-4 text-2xl font-semibold text-gray-800'
//                       {...props}
//                     />
//                   ),
//                   h3: ({ node, ...props }) => (
//                     <h3
//                       className='mt-6 mb-3 text-xl font-medium text-gray-700'
//                       {...props}
//                     />
//                   ),
//                   ul: ({ node, ...props }) => (
//                     <ul className='list-disc space-y-2 pl-6' {...props} />
//                   ),
//                   ol: ({ node, ...props }) => (
//                     <ol className='list-decimal space-y-2 pl-6' {...props} />
//                   ),
//                   li: ({ node, ...props }) => (
//                     <li className='text-gray-700' {...props} />
//                   ),
//                   p: ({ node, ...props }) => (
//                     <p className='mb-4 text-gray-700' {...props} />
//                   ),
//                   a: ({ node, ...props }) => (
//                     <a
//                       className='text-blue-600 underline hover:text-blue-800'
//                       {...props}
//                     />
//                   ),
//                   blockquote: ({ node, ...props }) => (
//                     <blockquote
//                       className='border-l-4 border-gray-300 pl-4 text-gray-600 italic'
//                       {...props}
//                     />
//                   )
//                 }}
//               >
//                 {modelInfo.docsMarkdown}
//               </ReactMarkdown>
//             </div>
//           </div>
//         )} */}

//         {/* Model Metadata */}
//         <div className='mt-8 rounded-xl bg-gray-100 p-6'>
//           <h3 className='mb-4 text-lg font-semibold text-gray-800'>
//             Model Information
//           </h3>
//           <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
//             <div>
//               <p className='text-sm text-gray-600'>Model ID</p>
//               <p className='font-mono text-sm text-gray-800'>
//                 {metaModelData.modelId}
//               </p>
//             </div>
//             <div>
//               <p className='text-sm text-gray-600'>Mode</p>
//               <p className='text-sm text-gray-800 capitalize'>
//                 {metaModelData.mode}
//               </p>
//             </div>
//             <div>
//               <p className='text-sm text-gray-600'>Status</p>
//               <span
//                 className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
//                   metaModelData.isPublished
//                     ? 'bg-green-100 text-green-800'
//                     : 'bg-gray-100 text-gray-800'
//                 }`}
//               >
//                 {metaModelData.isPublished ? 'Published' : 'Draft'}
//               </span>
//             </div>
//           </div>
//           {metaModelData.tags && metaModelData.tags.length > 0 && (
//             <div className='mt-4'>
//               <p className='mb-2 text-sm text-gray-600'>Tags</p>
//               <div className='flex flex-wrap gap-2'>
//                 {metaModelData.tags.map((tag, index) => (
//                   <span
//                     key={index}
//                     className='inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800'
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   // Custom output renderer for specific models
//   function renderCustomOutput(data: any) {
//     // Example for DuckDuckGo search results
//     if (data.abstract || data.relatedTopics || data.results) {
//       return (
//         <>
//           {data.abstract && (
//             <div className='mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4'>
//               <h3 className='mb-2 font-semibold text-blue-900'>Answer</h3>
//               <p className='text-gray-700'>{data.abstract}</p>
//               {data.abstractURL && (
//                 <a
//                   href={data.abstractURL}
//                   target='_blank'
//                   rel='noopener noreferrer'
//                   className='mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800'
//                 >
//                   <span>Source</span>
//                   <ExternalLink className='ml-1 h-3 w-3' />
//                 </a>
//               )}
//             </div>
//           )}

//           {data.definition && (
//             <div className='mb-4 rounded-lg border border-green-200 bg-green-50 p-4'>
//               <h3 className='mb-2 font-semibold text-green-900'>Definition</h3>
//               <p className='text-gray-700'>{data.definition}</p>
//               {data.definitionURL && (
//                 <a
//                   href={data.definitionURL}
//                   target='_blank'
//                   rel='noopener noreferrer'
//                   className='mt-2 inline-flex items-center text-sm text-green-600 hover:text-green-800'
//                 >
//                   <span>Source</span>
//                   <ExternalLink className='ml-1 h-3 w-3' />
//                 </a>
//               )}
//             </div>
//           )}

//           {data.results && data.results.length > 0 && (
//             <div className='mb-4'>
//               <h3 className='mb-3 font-semibold text-gray-900'>
//                 Search Results
//               </h3>
//               <div className='space-y-3'>
//                 {data.results.map((result: any, index: number) => (
//                   <div
//                     key={index}
//                     className='rounded-lg border border-gray-200 p-4'
//                   >
//                     <a
//                       href={result.FirstURL}
//                       target='_blank'
//                       rel='noopener noreferrer'
//                       className='font-medium text-blue-600 hover:text-blue-800'
//                     >
//                       {result.Text}
//                     </a>
//                     {result.Result && (
//                       <p className='mt-1 text-sm text-gray-600'>
//                         {result.Result}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {data.relatedTopics && data.relatedTopics.length > 0 && (
//             <div>
//               <h3 className='mb-3 font-semibold text-gray-900'>
//                 Related Topics
//               </h3>
//               <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
//                 {data.relatedTopics
//                   .slice(0, 6)
//                   .map((topic: any, index: number) => (
//                     <div
//                       key={index}
//                       className='rounded-lg border border-gray-200 p-3'
//                     >
//                       {topic.FirstURL ? (
//                         <a
//                           href={topic.FirstURL}
//                           target='_blank'
//                           rel='noopener noreferrer'
//                           className='text-sm text-blue-600 hover:text-blue-800'
//                         >
//                           {topic.Text}
//                         </a>
//                       ) : (
//                         <p className='text-sm text-gray-700'>{topic.Text}</p>
//                       )}
//                     </div>
//                   ))}
//               </div>
//             </div>
//           )}
//         </>
//       );
//     }

//     // Default JSON display
//     return (
//       <div className='overflow-auto rounded-lg bg-gray-50 p-4'>
//         <pre className='text-sm'>{JSON.stringify(data, null, 2)}</pre>
//       </div>
//     );
//   }
// }

export default async function Tool() {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <h1 className='text-2xl font-bold'>Tools</h1>
    </div>
  );
}
