import hashlib
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Dict, List

app = FastAPI()

# main.py의 위치를 기준으로 modpack 폴더 경로 설정
MODPACK_DIR = Path(__file__).parent / "modpack"
MODS_DIR = MODPACK_DIR / "mods"
CONFIG_DIR = MODPACK_DIR / "config"

# 디렉토리가 존재하는지 확인하고, 없으면 생성
MODS_DIR.mkdir(parents=True, exist_ok=True)
CONFIG_DIR.mkdir(parents=True, exist_ok=True)

class FileInfo(BaseModel):
    sha256: str

class FileManifest(BaseModel):
    mods: Dict[str, FileInfo]
    configs: Dict[str, FileInfo]

def get_file_sha256(file_path: Path) -> str:
    """파일의 SHA256 해시를 계산합니다."""
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        # 파일을 4096바이트씩 읽어 해시 업데이트
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

@app.get("/api/files", response_model=FileManifest)
async def get_files_manifest():
    """
    mods 및 config 디렉토리의 모든 파일 목록과
    각 파일의 SHA256 해시를 포함하는 Manifest를 제공합니다.
    """
    mods_manifest = {
        f.name: FileInfo(sha256=get_file_sha256(f))
        for f in MODS_DIR.glob("**/*") if f.is_file()
    }
    configs_manifest = {
        f.name: FileInfo(sha256=get_file_sha256(f))
        for f in CONFIG_DIR.glob("**/*") if f.is_file()
    }
    return FileManifest(mods=mods_manifest, configs=configs_manifest)

@app.get("/api/download/{directory}/{file_name}")
async def download_file(directory: str, file_name: str):
    """
    'mods' 또는 'config' 디렉토리에서 특정 파일을 다운로드합니다.
    """
    if directory not in ["mods", "config"]:
        raise HTTPException(status_code=400, detail="잘못된 디렉토리입니다.")

    base_path = MODS_DIR if directory == "mods" else CONFIG_DIR
    
    # 경로 조작 공격 방지를 위해 파일 경로 검증
    try:
        file_path = (base_path / file_name).resolve(strict=True)
        if not file_path.is_file() or not file_path.is_relative_to(base_path.resolve()):
             raise FileNotFoundError
    except (FileNotFoundError, ValueError):
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다.")

    return FileResponse(str(file_path), filename=file_name)

@app.get("/")
async def root():
    return {"message": "MCLauncher 서버가 실행중입니다."}