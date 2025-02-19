export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    parentTaskId: number | null;
    userId: number;
    createdAt: string;
    updatedAt: string;
    parentTask: {
      id: number;
      title: string;
    } | null;
}