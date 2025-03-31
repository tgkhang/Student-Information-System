// import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { AzureStorageService } from './azure-storage.service';

// @Controller('upload')
// export class UploadController {
//   constructor(private readonly azureStorageService: AzureStorageService) {}

//   // Endpoint để tải lên file
//   @Post('file')
//   @UseInterceptors(FileInterceptor('file', { storage: this.azureStorageService.getMulterStorage() }))  // Dùng Multer để upload file lên Azure
//   async uploadFile(@UploadedFile() file) {
//     const fileUrl = await this.azureStorageService.uploadFile(file);
//     return { message: 'File uploaded successfully', fileUrl };
//   }
// }
