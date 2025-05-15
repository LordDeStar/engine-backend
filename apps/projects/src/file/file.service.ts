import { Injectable } from '@nestjs/common';
import { CreateFolderDto } from '../dto/file-dto/create-folder.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UploadFileDto } from 'src/dto/file-dto/upload-file.dto';
import { error } from 'console';


@Injectable()
export class FileService {
    constructor(private readonly prisma: PrismaService) { }

    public async createFolder(dto: CreateFolderDto) {
        try {
            await this.prisma.projectItem.create({
                data: {
                    ...dto,
                    type: "FOLDER"
                }
            });
            return { ok: 'ok' };
        }
        catch {
            return { error: "Creation failed" };
        }

    }

    public async uploadFile(dto: UploadFileDto) {
        try {
            const file = await this.prisma.projectItem.create({
                data: {
                    type: "File",
                    title: dto.title,
                    parentId: dto.parentId,
                    projectId: dto.projectId,
                    fileUrl: `http://localhost:3003${dto.folderPath}/${dto.title}`
                }
            });
            return { ok: 'ok', file };
        }
        catch {
            return { error: 'Ошибка при сохранении файла!' };
        }
    }
    public async getStartFolders(project: number) {
        try {
            const folders = await this.prisma.projectItem.findMany({
                where: {
                    projectId: project,
                    parentId: null,
                    type: "FOLDER"
                },
                select: {
                    id: true,
                    title: true
                }
            });
            if (folders) {
                return folders;
            }
            else {
                return { error: 'Папки не найдены!' };
            }
        }
        catch {
            return { error: 'Неизвестная ошибка при добавлении попытке получить файлы', project };
        }
    }

    public async getStartFiles(project: number) {
        try {
            const files = await this.prisma.projectItem.findMany({
                where: {
                    projectId: project,
                    parentId: null,
                    type: "File"
                },
                select: {
                    id: true,
                    fileUrl: true,
                    title: true
                }
            });
            if (files) {
                return files;
            }
            else {
                return { error: 'Файлы не найдены!' };
            }
        }
        catch {
            return { error: 'Неизвестная ошибка при добавлении попытке получить файлы', project };
        }
    }

    public async getFilesInFolder(parentId: number) {
        try {
            const folder = await this.prisma.projectItem.findFirst({
                where: {
                    id: parentId,
                    type: 'FOLDER'
                },
                select: {
                    children: {
                        where: {
                            type: 'File'
                        },
                        select: {
                            id: true,
                            fileUrl: true,
                            title: true,
                        }
                    }
                }
            });
            if (folder) {
                return folder.children;
            }
            else {
                return { error: 'Папка не найдена!', parentId };
            }
        }
        catch {
            return { error: 'Неизвестная ошибка при добавлении попытке получить файлы', parentId };
        }
    }
    public async getFoldersInFolder(parentId: number) {
        try {
            const folder = await this.prisma.projectItem.findFirst({
                where: {
                    id: parentId,
                    type: 'FOLDER'
                },
                select: {
                    children: {
                        where: {
                            type: 'FOLDER'
                        },
                        select: {
                            id: true,
                            title: true,
                        }
                    }
                }
            });
            if (folder) {
                return folder.children;
            }
            else {
                return { error: 'Папка не найдена!', parentId };
            }
        }
        catch {
            return { error: 'Неизвестная ошибка при добавлении попытке получить файлы', parentId };
        }
    }
}
