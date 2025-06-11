import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  async createFile(file: Express.Multer.File): Promise<string> {
    try {
      if (!file) {
        throw new HttpException('Файл не предоставлен', HttpStatus.BAD_REQUEST);
      }

      const fileName = uuid.v4() + '.jpg';
      const filePath = path.resolve(__dirname, '..', 'static');
      if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true });
      await fs.promises.writeFile(path.join(filePath, fileName), file.buffer);

      return fileName;
    } catch (error) {
      console.error('Ошибка при записи файла:', error);

      throw new HttpException(
        'Произошла ошибка при записи файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
