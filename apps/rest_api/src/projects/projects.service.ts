import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { CreateFolderDto } from 'src/dto/project/create-folder.dto';
import { CreateProjectDto } from 'src/dto/project/create-project.dto';
import axios from 'axios';

@Injectable()
export class ProjectsService implements OnModuleInit {
    constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafkaProxy) { }

    public async onModuleInit() {
        this.kafkaClient.subscribeToResponseOf('create.folder');
        this.kafkaClient.subscribeToResponseOf('create.project');
        this.kafkaClient.subscribeToResponseOf('get.all.projects');
        this.kafkaClient.subscribeToResponseOf('get.path.to.folder');
        this.kafkaClient.subscribeToResponseOf('upload.file');
        this.kafkaClient.subscribeToResponseOf('get.files');
        this.kafkaClient.subscribeToResponseOf('get.start.folders');
        this.kafkaClient.subscribeToResponseOf('get.folders');
        this.kafkaClient.subscribeToResponseOf('get.start.files');
    }

    public async createProject(dto: CreateProjectDto, userId: number) {
        const response = await axios.post('http://cdn:3000/create-project', { userId: userId, title: dto.title });
        if (response.data.ok) {
            return await this.kafkaClient.send('create.project', { ...dto, ownerId: userId }).toPromise();
        }
        else {
            return response.data;
        }
    }
    public async getProjects(userId: number) {
        try {
            return await this.kafkaClient.send('get.all.projects', userId).toPromise();
        }
        catch (error) {
            console.error(error)
        }

    }
    public async createFolder(userId: number, dto: CreateFolderDto): Promise<any> {
        const pathToFolder = await this.kafkaClient.send('get.path.to.folder', { parentId: dto.parentId, projectId: dto.projectId }).toPromise();
        const path = `/user-${userId}/` + pathToFolder;
        const response = await this.kafkaClient.send('create.folder', dto).toPromise();
        if (response.ok) {
            const res = await axios.post('http://cdn:3000/create-folder', { pathToFolder: path, title: dto.title });
            if (res.data.ok) {
                return res.data;
            }
            return { error: "Ошибка при создании папки!" };
        }
        return { error: "Ошибка при записи в базу!" };
    }
    public async uploadFile(
        userId: number,
        file: Express.Multer.File,
        parentId: number,
        projectId: number
    ) {
        try {
            console.log("Я работаю!");

            // Получаем путь к папке через Kafka
            const folderPath = `/user-${userId}/` + await this.kafkaClient
                .send('get.path.to.folder', { parentId, projectId })
                .toPromise();


            // Отправляем файл на CDN
            const response = await axios.post('http://cdn:3000/upload', {
                file: file.buffer.toString('base64'),
                folderPath,
                fileName: file.originalname
            }, {
                headers: {
                    "Content-Type": 'application/json'
                },
            });

            // Проверяем ответ от CDN
            if (response.data.ok) {
                await this.kafkaClient
                    .send('upload.file', { parentId, projectId, title: file.originalname, folderPath })
                    .toPromise();
                return { message: 'Файл успешно загружен' };
            }

            return { error: 'Ошибка при загрузке файла' };
        } catch (error) {
            console.error('Произошла ошибка при обработке запроса:', error);
            return { error: 'Произошла ошибка при обработке запроса' };
        }
    }
    public async getFiles(parentId: number) {
        return await this.kafkaClient.send('get.files', { parentId });
    }
    public async getStartFolders(projectId: number) {
        return await this.kafkaClient.send('get.start.folders', { projectId });
    }
    public async getFolders(parentId: number) {
        return await this.kafkaClient.send('get.folders', { parentId });
    }
    public async getStartFiles(projectId: number) {
        return await this.kafkaClient.send('get.start.files', { projectId });
    }
    public async saveProject(userId: number, projectId: number, json: string[]) {
        const projects: any[] = await this.getProjects(userId);
        const title = projects.filter(item => item.id == projectId)[0];
        const response = await axios.post('http://cdn:3000/save', { userId, title: title.title, json }, {
            headers: {
                "Content-Type": 'application/json'
            },
        });
        if (response.data.ok) {
            return { message: response.data.ok };
        }
        return { error: response.data.error };
    }


    public async loadProjects(userId: number, projectId: number) {
        const projects: any[] = await this.getProjects(userId);
        const title = projects.filter(item => item.id == projectId)[0];
        return { path: `http://localhost:3003/user-${userId}/${title.title}/save.json` };
    }
}