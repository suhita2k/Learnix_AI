import { UploadedFile } from '../types';

const FILES_KEY = 'learnix_files';

export class FileService {
  private getFiles(): UploadedFile[] {
    const filesJson = localStorage.getItem(FILES_KEY);
    return filesJson ? JSON.parse(filesJson) : [];
  }

  private saveFiles(files: UploadedFile[]): void {
    localStorage.setItem(FILES_KEY, JSON.stringify(files));
  }

  async uploadFile(userId: string, file: File): Promise<{ success: boolean; message: string; fileId?: string }> {
    try {
      const content = await this.readFileContent(file);
      
      const uploadedFile: UploadedFile = {
        id: Date.now().toString(),
        userId,
        fileName: file.name,
        uploadDate: new Date().toISOString(),
        content,
        fileSize: file.size,
      };

      const files = this.getFiles();
      files.push(uploadedFile);
      this.saveFiles(files);

      return { success: true, message: 'File uploaded successfully', fileId: uploadedFile.id };
    } catch (error) {
      return { success: false, message: 'Failed to upload file' };
    }
  }

  private async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        // For text files, return as is
        // For PDFs, we'd need a library, but for demo purposes we'll use a placeholder
        if (file.type === 'application/pdf') {
          resolve(`[PDF Content from ${file.name}]\n\nThis is a placeholder for PDF content. In a production environment, PDF parsing would extract the actual text content.`);
        } else {
          resolve(content);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      if (file.type === 'application/pdf') {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  }

  getUserFiles(userId: string): UploadedFile[] {
    const files = this.getFiles();
    return files.filter(f => f.userId === userId);
  }

  getFile(fileId: string): UploadedFile | null {
    const files = this.getFiles();
    return files.find(f => f.id === fileId) || null;
  }

  deleteFile(fileId: string, userId: string): boolean {
    const files = this.getFiles();
    const fileIndex = files.findIndex(f => f.id === fileId && f.userId === userId);
    
    if (fileIndex === -1) return false;
    
    files.splice(fileIndex, 1);
    this.saveFiles(files);
    return true;
  }
}

export const fileService = new FileService();
