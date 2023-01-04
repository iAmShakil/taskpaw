// sorts tasks by status. running first, then not started, then done
export const sortByStatus = (tasks = []) => {
  const TASK_STATUS_PRIORITY = {
    NOT_STARTED: 1,
    RUNNING: 0,
    COMPLETED: 2
  }
  return tasks.map(task => ({
    ...task,
    statusPriority: TASK_STATUS_PRIORITY[task.status]
  })).sort((a, b) => a.statusPriority - b.statusPriority).map((task) => {
    delete task.statusPriority
    return task
  })
}
