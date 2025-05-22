import { Controller, UseGuards, Post, Body, Get, UseInterceptors, UploadedFile, Query, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateProjectDto } from 'src/dto/project/create-project.dto';
import { UserId } from 'src/decorators/user.decorator';

import { CreateFolderDto } from 'src/dto/project/create-folder.dto';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }


  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  public async createProject(@Body() dto: CreateProjectDto, @UserId() userId: number) {
    return await this.projectsService.createProject(dto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  public async getAll(@UserId() userId: number) {
    try {
      return await this.projectsService.getProjects(userId);
    }
    catch (error) {
      console.log(error)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  public async sendFile(
    @UserId() userId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: any) {
    return await this.projectsService.uploadFile(userId, file, Number(data.parentId), Number(data.projectId));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':parent/files')
  public async getFiles(@Param('parent') folder: string) {
    return await this.projectsService.getFiles(Number(folder));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':project/start-files')
  public async getStartFiles(@Param('project') project: string) {
    return await this.projectsService.getStartFiles(Number(project));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':project/start-folders')
  public async getStartFolders(@Param('project') project: string) {
    return await this.projectsService.getStartFolders(Number(project));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':parent/folders')
  public async getFolders(@Param('parent') folder: string) {
    return await this.projectsService.getFolders(Number(folder));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create-folder')
  public async createFolder(@UserId() userId: number, @Body() dto: CreateFolderDto) {
    console.log(dto);
    return await this.projectsService.createFolder(userId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':project/save')
  public async saveProject(@UserId() userId: number, @Param('project') projectId: string, @Body() data: { json: string[] }) {
    return await this.projectsService.saveProject(userId, Number(projectId), data.json);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':project/load')
  public async loadProject(@UserId() userId: number, @Param('project') projectId: string) {
    return await this.projectsService.loadProjects(userId, Number(projectId));
  }
}
