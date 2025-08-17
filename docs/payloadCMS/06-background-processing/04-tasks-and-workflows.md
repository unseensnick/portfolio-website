# Tasks and Workflows

## Tasks

A "Task" is a function definition that performs business logic and whose input and output are both strongly typed.

You can register Tasks on the Payload config, and then create Jobs or Workflows that use them. Think of Tasks like tidy, isolated "functions that do one specific thing".

Payload Tasks can be configured to automatically retried if they fail, which makes them valuable for "durable" workflows like AI applications where LLMs can return non-deterministic results, and might need to be retried.

Tasks can either be defined within the jobs.tasks array in your Payload config, or they can be defined inline within a workflow.

### Defining tasks in the config

Simply add a task to the jobs.tasks array in your Payload config. A task consists of the following fields:

| Option | Description |
|--------|-------------|
| slug | Define a slug-based name for this job. This slug needs to be unique among both tasks and workflows. |
| handler | The function that should be responsible for running the job. You can either pass a string-based path to the job function file, or the job function itself. If you are using large dependencies within your job, you might prefer to pass the string path because that will avoid bundling large dependencies in your Next.js app. Passing a string path is an advanced feature that may require a sophisticated build pipeline in order to work. |
| inputSchema | Define the input field schema - Payload will generate a type for this schema. |
| interfaceName | You can use interfaceName to change the name of the interface that is generated for this task. By default, this is "Task" + the capitalized task slug. |
| outputSchema | Define the output field schema - Payload will generate a type for this schema. |
| label | Define a human-friendly label for this task. |
| onFail | Function to be executed if the task fails. |
| onSuccess | Function to be executed if the task succeeds. |
| retries | Specify the number of times that this step should be retried if it fails. If this is undefined, the task will either inherit the retries from the workflow or have no retries. If this is 0, the task will not be retried. By default, this is undefined. |

The logic for the Task is defined in the handler - which can be defined as a function, or a path to a function. The handler will run once a worker picks up a Job that includes this task.

It should return an object with an output key, which should contain the output of the task as you've defined.

### Example Task Configuration

```javascript
export default buildConfig({
  // ...
  jobs: {
    tasks: [
      {
        // Configure this task to automatically retry
        // up to two times
        retries: 2,

        // This is a unique identifier for the task
        slug: 'createPost',

        // These are the arguments that your Task will accept
        inputSchema: [
          {
            name: 'title',
            type: 'text',
            required: true,
          },
        ],

        // These are the properties that the function should output
        outputSchema: [
          {
            name: 'postID',
            type: 'text',
            required: true,
          },
        ],

        // This is the function that is run when the task is invoked
        handler: async ({ input, job, req }) => {
          const newPost = await req.payload.create({
            collection: 'post',
            req,
            data: {
              title: input.title,
            },
          })
          return {
            output: {
              postID: newPost.id,
            },
          }
        },
      } as TaskConfig<'createPost'>,
    ],
  },
})
```

### Task Handlers with File Paths

In addition to defining handlers as functions directly provided to your Payload config, you can also pass an absolute path to where the handler is defined. If your task has large dependencies, and you are planning on executing your jobs in a separate process that has access to the filesystem, this could be a handy way to make sure that your Payload + Next.js app remains quick to compile and has minimal dependencies.

Keep in mind that this is an advanced feature that may require a sophisticated build pipeline, especially when using it in production or within Next.js, e.g. by calling opening the /api/payload-jobs/run endpoint. You will have to transpile the handler files separately and ensure they are available in the same location when the job is run. If you're using an endpoint to execute your jobs, it's recommended to define your handlers as functions directly in your Payload Config, or use import paths handlers outside of Next.js.

**payload.config.ts:**
```javascript
import { fileURLToPath } from 'node:url'
import path from 'path'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  jobs: {
    tasks: [
      {
        // ...
        // The #createPostHandler is a named export within the `createPost.ts` file
        handler:
          path.resolve(dirname, 'src/tasks/createPost.ts') +
          '#createPostHandler',
      },
    ],
  },
})
```

**src/tasks/createPost.ts:**
```javascript
import type { TaskHandler } from 'payload'

export const createPostHandler: TaskHandler<'createPost'> = async ({
  input,
  job,
  req,
}) => {
  const newPost = await req.payload.create({
    collection: 'post',
    req,
    data: {
      title: input.title,
    },
  })
  return {
    output: {
      postID: newPost.id,
    },
  }
}
```

### Configuring task restoration

By default, if a task has passed previously and a workflow is re-run, the task will not be re-run. Instead, the output from the previous task run will be returned. This is to prevent unnecessary re-runs of tasks that have already passed.

You can configure this behavior through the `retries.shouldRestore` property. This property accepts a boolean or a function.

- If `shouldRestore` is set to `true`, the task will only be re-run if it previously failed. This is the default behavior.
- If `shouldRestore` this is set to `false`, the task will be re-run even if it previously succeeded, ignoring the maximum number of retries.
- If `shouldRestore` is a function, the return value of the function will determine whether the task should be re-run. This can be used for more complex restore logic, e.g you may want to re-run a task up to X amount of times and then restore it for consecutive runs, or only re-run a task if the input has changed.

**Example:**
```javascript
export default buildConfig({
  // ...
  jobs: {
    tasks: [
      {
        slug: 'myTask',
        retries: {
          shouldRestore: false,
        },
        // ...
      } as TaskConfig<'myTask'>,
    ],
  },
})
```

**Example - determine whether a task should be restored based on the input data:**
```javascript
export default buildConfig({
  // ...
  jobs: {
    tasks: [
      {
        slug: 'myTask',
        inputSchema: [
          {
            name: 'someDate',
            type: 'date',
            required: true,
          },
        ],
        retries: {
          shouldRestore: ({ input }) => {
            if (new Date(input.someDate) > new Date()) {
              return false
            }
            return true
          },
        },
        // ...
      } as TaskConfig<'myTask'>,
    ],
  },
})
```

### Nested tasks

You can run sub-tasks within an existing task, by using the tasks or inlineTask arguments passed to the task handler function:

```javascript
export default buildConfig({
  // ...
  jobs: {
    // It is recommended to set `addParentToTaskLog` to `true` when using nested tasks, so that the parent task is included in the task log
    // This allows for better observability and debugging of the task execution
    addParentToTaskLog: true,
    tasks: [
      {
        slug: 'parentTask',
        inputSchema: [
          {
            name: 'text',
            type: 'text',
          },
        ],
        handler: async ({ input, req, tasks, inlineTask }) => {
          await inlineTask('Sub Task 1', {
            task: () => {
              // Do something
              return {
                output: {},
              }
            },
          })

          await tasks.CreateSimple('Sub Task 2', {
            input: { message: 'hello' },
          })

          return {
            output: {},
          }
        },
      } as TaskConfig<'parentTask'>,
    ],
  },
})
```

## Workflows

A "Workflow" is an optional way to combine multiple tasks together in a way that can be gracefully retried from the point of failure.

They're most helpful when you have multiple tasks in a row, and you want to configure each task to be able to be retried if they fail.

If a task within a workflow fails, the Workflow will automatically "pick back up" on the task where it failed and not re-execute any prior tasks that have already been executed.

### Defining a workflow

The most important aspect of a Workflow is the handler, where you can declare when and how the tasks should run by simply calling the runTask function. If any task within the workflow, fails, the entire handler function will re-run.

However, importantly, tasks that have successfully been completed will simply re-return the cached and saved output without running again. The Workflow will pick back up where it failed and only task from the failure point onward will be re-executed.

To define a JS-based workflow, simply add a workflow to the jobs.workflows array in your Payload config. A workflow consists of the following fields:

| Option | Description |
|--------|-------------|
| slug | Define a slug-based name for this workflow. This slug needs to be unique among both tasks and workflows. |
| handler | The function that should be responsible for running the workflow. You can either pass a string-based path to the workflow function file, or workflow job function itself. If you are using large dependencies within your workflow, you might prefer to pass the string path because that will avoid bundling large dependencies in your Next.js app. Passing a string path is an advanced feature that may require a sophisticated build pipeline in order to work. |
| inputSchema | Define the input field schema - Payload will generate a type for this schema. |
| interfaceName | You can use interfaceName to change the name of the interface that is generated for this workflow. By default, this is "Workflow" + the capitalized workflow slug. |
| label | Define a human-friendly label for this workflow. |
| queue | Optionally, define the queue name that this workflow should be tied to. Defaults to "default". |
| retries | You can define retries on the workflow level, which will enforce that the workflow can only fail up to that number of retries. If a task does not have retries specified, it will inherit the retry count as specified on the workflow. You can specify 0 as workflow retries, which will disregard all task retry specifications and fail the entire workflow on any task failure. You can leave workflow retries as undefined, in which case, the workflow will respect what each task dictates as their own retry count. By default this is undefined, meaning workflows retries are defined by their tasks |

### Example Workflow Configuration

```javascript
export default buildConfig({
  // ...
  jobs: {
    tasks: [
      // ...
    ]
    workflows: [
      {
        slug: 'createPostAndUpdate',

        // The arguments that the workflow will accept
        inputSchema: [
          {
            name: 'title',
            type: 'text',
            required: true,
          },
        ],

        // The handler that defines the "control flow" of the workflow
        // Notice how it uses the `tasks` argument to execute your predefined tasks.
        // These are strongly typed!
        handler: async ({ job, tasks }) => {

          // This workflow first runs a task called `createPost`.

          // You need to define a unique ID for this task invocation
          // that will always be the same if this workflow fails
          // and is re-executed in the future. Here, we hard-code it to '1'
          const output = await tasks.createPost('1', {
            input: {
              title: job.input.title,
            },
          })

          // Once the prior task completes, it will run a task
          // called `updatePost`
          await tasks.updatePost('2', {
            input: {
              post: job.taskStatus.createPost['1'].output.postID, // or output.postID
              title: job.input.title + '2',
            },
          })
        },
      } as WorkflowConfig<'updatePost'>
    ]
  }
})
```

### Running tasks inline

In the above example, our workflow was executing tasks that we already had defined in our Payload config. But, you can also run tasks without predefining them.

To do this, you can use the `inlineTask` function.

The drawbacks of this approach are that tasks cannot be re-used across workflows as easily, and the task data stored in the job will not be typed. In the following example, the inline task data will be stored on the job under `job.taskStatus.inline['2']` but completely untyped, as types for dynamic tasks like these cannot be generated beforehand.

**Example:**
```javascript
export default buildConfig({
  // ...
  jobs: {
    tasks: [
      // ...
    ]
    workflows: [
      {
        slug: 'createPostAndUpdate',
        inputSchema: [
          {
            name: 'title',
            type: 'text',
            required: true,
          },
        ],
        handler: async ({ job, tasks, inlineTask }) => {
          // Here, we run a predefined task.
          // The `createPost` handler arguments and return type
          // are both strongly typed
          const output = await tasks.createPost('1', {
            input: {
              title: job.input.title,
            },
          })

          // Here, this task is not defined in the Payload config
          // and is "inline". Its output will be stored on the Job in the database
          // however its arguments will be untyped.
          const { newPost } = await inlineTask('2', {
            task: async ({ req }) => {
              const newPost = await req.payload.update({
                collection: 'post',
                id: '2',
                req,
                retries: 3,
                data: {
                  title: 'updated!',
                },
              })
              return {
                output: {
                  newPost
                },
              }
            },
          })
        },
      } as WorkflowConfig<'updatePost'>
    ]
  }
})
```