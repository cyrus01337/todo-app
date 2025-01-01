// TODO: Use as enum with string literals
type Tag = string;

export interface Entry {
    completed: boolean;
    description: string;
    id: number;
    tags: Tag[];
    title: string;
    dueDate?: Date;
}
