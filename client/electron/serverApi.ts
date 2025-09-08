import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:8000';

export interface ModpackFile {
  path: string;
  hash: string;
  size: number;
}

export interface ModpackManifest {
  files: ModpackFile[];
  version: string;
}

/**
 * 서버의 상태를 확인합니다.
 * @returns 서버가 온라인이면 true, 아니면 false를 반환합니다.
 */
export const getServerStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/status`);
    return response.ok;
  } catch (error) {
    console.error('Error checking server status:', error);
    return false;
  }
};

/**
 * 서버로부터 전체 모드팩의 파일 목록과 버전 정보를 가져옵니다.
 * @returns ModpackManifest 객체를 반환합니다.
 */
export const getModpackManifest = async (): Promise<ModpackManifest> => {
  const response = await fetch(`${API_BASE_URL}/manifest`);
  if (!response.ok) {
    throw new Error('Failed to fetch modpack manifest');
  }
  return response.json() as Promise<ModpackManifest>;
};

/**
 * 서버로부터 특정 파일을 다운로드하여 스트림으로 반환합니다.
 * @param filePath 다운로드할 파일의 서버 내 상대 경로
 * @returns 파일의 ReadableStream을 반환합니다.
 */
export const downloadFile = async (filePath: string): Promise<NodeJS.ReadableStream> => {
  const response = await fetch(`${API_BASE_URL}/files/${filePath}`);
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download file: ${filePath}`);
  }
  return response.body;
};

/**
 * 특정 설정 파일에 대해 서버 버전과 로컬 파일의 차이점을 가져옵니다.
 * @param filePath 비교할 파일의 경로
 * @param localFileContent 비교할 로컬 파일의 내용
 * @returns Unified diff 형식의 문자열을 반환합니다.
 */
export const getFileDiff = async (filePath: string, localFileContent: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/diff`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path: filePath, content: localFileContent }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get diff for file: ${filePath}`);
  }
  const result = await response.json();
  return result.diff;
};
