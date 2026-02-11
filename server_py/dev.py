import os
import subprocess
import httpx
from fastapi import FastAPI, Request
from fastapi.responses import Response
import uvicorn
from contextlib import asynccontextmanager
import asyncio

from .main import create_app

vite_process = None

async def stream_vite_output():
    global vite_process
    loop = asyncio.get_event_loop()
    while vite_process and vite_process.poll() is None:
        if vite_process.stdout:
            line = await loop.run_in_executor(None, vite_process.stdout.readline)
            if line:
                print(f"[vite] {line.decode(errors='replace').strip()}")
        await asyncio.sleep(0.01)

def start_vite():
    global vite_process
    vite_process = subprocess.Popen(
        ["npx", "vite", "--port", "5173", "--host", "0.0.0.0"],
        cwd=os.getcwd(),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        shell=True,
    )

    if vite_process.stdout:
        for line in iter(vite_process.stdout.readline, b''):
            text = line.decode(errors='replace').strip()
            if text:
                print(f"[vite] {text}")
            if "ready" in text.lower() or "5173" in text:
                break
    
    return vite_process

def stop_vite():
    global vite_process
    if vite_process:
        vite_process.terminate()
        vite_process.wait()

api_app = create_app(serve_static=False)

@asynccontextmanager
async def dev_lifespan(app: FastAPI):
    start_vite()
    asyncio.create_task(stream_vite_output())
    
    async with api_app.router.lifespan_context(api_app):
        yield
    
    stop_vite()

dev_app = FastAPI(title="Spoiler Guard Dev", lifespan=dev_lifespan)

for route in api_app.routes:
    dev_app.routes.append(route)

@dev_app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"])
async def proxy_to_vite(request: Request, path: str):
    if "upgrade" in request.headers.get("connection", "").lower():
        return Response(content="WebSocket not proxied", status_code=400)
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        url = f"http://localhost:5173/{path}"
        if request.query_params:
            url += f"?{request.query_params}"
        
        headers = {k: v for k, v in request.headers.items() if k.lower() not in ("host", "connection", "upgrade")}
        
        try:
            if request.method == "GET":
                resp = await client.get(url, headers=headers)
            else:
                body = await request.body()
                resp = await client.request(request.method, url, headers=headers, content=body)
            
            resp_headers = {k: v for k, v in resp.headers.items() if k.lower() not in ("transfer-encoding", "content-encoding", "content-length")}
            
            return Response(
                content=resp.content,
                status_code=resp.status_code,
                headers=resp_headers
            )
        except httpx.ConnectError:
            return Response(content="Vite server not ready", status_code=503)

if __name__ == "__main__":
    uvicorn.run("server_py.dev:dev_app", host="0.0.0.0", port=5000, reload=False)
