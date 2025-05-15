export class CreateFolderDto {
    public title: string;
    public projectId: number;
    public parentId: number | null;
}