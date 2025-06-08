import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateProjectDto } from './dto/project-dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) { }

  public async getProjects(userId: number) {
    return await this.prisma.project.findMany({
      where: {
        ownerId: Number(userId)
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true
      }
    })
  }
  public async createProject(dto: CreateProjectDto): Promise<any> {
    try {
      const project = await this.prisma.project.create({
        data: {
          ...dto
        }
      });
      return { message: "ok" };
    }
    catch {
      return { error: "Creation failed" };
    }
  }
  public async getFolderPath(parentId: number | undefined, projectId: number): Promise<string> {
    console.log("\n\nЯ работаю!\n");
    console.log(parentId);
    let folder = await this.prisma.projectItem.findFirst({
      where: {
        id: (parentId) ? Number(parentId) : -1
      },
    });
    console.log(folder);
    let result: string[] = [];
    while (folder) {
      result.push(folder.title);
      folder = await this.prisma.projectItem.findFirst({
        where: {
          id: (folder.parentId) ? folder.parentId : -1
        }
      });
    }

    const projectTitle = await this.prisma.project.findFirst({
      where: {
        id: Number(projectId)
      },
      select: {
        title: true
      }
    });
    if (projectTitle?.title) {
      result.push(projectTitle?.title);
    }
    result = result.reverse();
    console.log(result.join('/'));
    return result.join('/');
  }
  public async getOne(dto: { userId: number, projectId: number }) {
    return await this.prisma.project.findMany({
      where: {
        ownerId: Number(dto.userId),
        id: Number(dto.projectId)
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true
      }
    })
  }
  public async deleteProject(projectId: number) {
    const deletedProject = await this.prisma.project.delete({
      where: { id: projectId },
      include: { items: true }
    });

    return { ok: "Проект удален!" }
  }
}
