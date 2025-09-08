import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as crypto from 'crypto';

const MODPACK_DIR_NAME = 'MyModpack'; // 예시 모드팩 이름

/**
 * 마인크래프트 데이터 디렉토리 경로를 반환합니다.
 * @returns 마인크래프트 데이터 디렉토리의 절대 경로
 */
export const getMinecraftPath = (): string => {
  return path.join(app.getPath('appdata'), '.minecraft');
};

/**
 * 모드팩이 설치될 디렉토리 경로를 반환하고, 폴더가 없으면 생성합니다.
 * @returns 모드팩 디렉토리의 절대 경로
 */
export const ensureModpackDirectory = async (): Promise<string> => {
  const mcPath = getMinecraftPath();
  const modpackPath = path.join(mcPath, 'modpacks', MODPACK_DIR_NAME);
  await fs.ensureDir(modpackPath);
  return modpackPath;
};

/**
 * 지정된 경로에 있는 모든 파일의 목록과 해시를 재귀적으로 생성합니다.
 * @param directoryPath 스캔할 디렉토리 경로
 * @returns 파일 경로와 해시 정보를 담은 객체 배열
 */
export const getLocalManifest = async (directoryPath: string): Promise<{ path: string; hash: string }[]> => {
  const files = await fs.readdir(directoryPath);
  const manifest: { path: string; hash: string }[] = [];

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      manifest.push(...(await getLocalManifest(filePath)));
    } else {
      const hash = await getFileHash(filePath);
      manifest.push({ path: path.relative(directoryPath, filePath), hash });
    }
  }
  return manifest;
};

/**
 * 파일의 SHA256 해시를 계산합니다.
 * @param filePath 해시를 계산할 파일의 경로
 * @returns 계산된 해시 문자열
 */
export const getFileHash = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
};

/**
 * 파일 스트림을 사용하여 파일을 저장합니다.
 * @param filePath 저장할 파일의 전체 경로
 * @param stream 파일 데이터를 담은 ReadableStream
 */
export const writeFileFromStream = (filePath: string, stream: NodeJS.ReadableStream): Promise<void> => {
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath);
    stream.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}; 

/**
 * 파일을 읽어 문자열로 반환합니다.
 * @param filePath 읽을 파일의 경로
 * @returns 파일 내용 문자열
 */
export const readFileContent = (filePath: string): Promise<string> => {
  return fs.readFile(filePath, 'utf-8');
};

/**
 * 파일을 삭제합니다.
 * @param filePath 삭제할 파일의 경로
 */
export const deleteFile = (filePath: string): Promise<void> => {
  return fs.remove(filePath);
};
