import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller, Get } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/project-dto/create-project.dto';
import { CreateFolderDto } from './dto/file-dto/create-folder.dto';
import { FileService } from './file/file.service';
import { UploadFileDto } from './dto/file-dto/upload-file.dto';

@Controller()
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly fileService: FileService
  ) { }

  @MessagePattern('create.project')
  public async createProject(@Payload() dto: CreateProjectDto) {
    return await this.projectsService.createProject(dto);
  }

  @MessagePattern('create.folder')
  public async createFolder(@Payload() dto: CreateFolderDto) {
    return await this.fileService.createFolder(dto);
  }

  @MessagePattern('get.all.projects')
  public async getAll(@Payload() userId: number) {
    return await this.projectsService.getProjects(userId);
  }

  @MessagePattern('get.path.to.folder')
  public async getPathToFolder(@Payload() dto: { parentId: number | undefined, projectId: number }) {
    return await this.projectsService.getFolderPath(dto.parentId, dto.projectId);
  }

  @MessagePattern('upload.file')
  public async uploadFile(@Payload() dto: UploadFileDto) {
    return await this.fileService.uploadFile(dto);
  }

  @MessagePattern('get.files')
  public async getFiles(@Payload() parent: { parentId: number }) {
    return await this.fileService.getFilesInFolder(parent.parentId);
  }

  @MessagePattern('get.start.files')
  public async getStartFiles(@Payload() project: { projectId: number }) {
    return await this.fileService.getStartFiles(project.projectId);
  }

  @MessagePattern('get.folders')
  public async getFolders(@Payload() parent: { parentId: number }) {
    return await this.fileService.getFoldersInFolder(parent.parentId);
  }

  @MessagePattern('get.start.folders')
  public async getStartFolders(@Payload() project: { projectId: number }) {
    return await this.fileService.getStartFolders(project.projectId);
  }
}
