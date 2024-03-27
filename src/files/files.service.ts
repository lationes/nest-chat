import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fsPromise from 'fs/promises';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import { extension } from 'mime-types';

@Injectable()
export class FilesService {
  async createFile(file: Express.Multer.File): Promise<string> {
    try {
      const extName = extension(file.mimetype);
      const fileName = uuid.v4() + `.${extName}`;
      const filePath = path.resolve(__dirname, '..', 'static');

      if (!fs.existsSync(filePath)) {
        await fsPromise.mkdir(filePath, { recursive: true });
      }
      await fsPromise.writeFile(path.join(filePath, fileName), file.buffer);

      return fileName;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        'Error during file upload',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteFile(fileName: string) {
    try {
      const filePath = path.resolve(__dirname, '..', 'static');

      fs.unlink(path.join(filePath, fileName), function (err) {
        if (err && err.code == 'ENOENT') {
          console.info("File doesn't exist, won't remove it.");
          return false;
        } else if (err) {
          console.error('Error occurred while trying to remove file');
        } else {
          console.info(`removed`);
        }
      });
    } catch (e) {
      console.log(e);
      throw new HttpException(
        'Error during file upload',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
