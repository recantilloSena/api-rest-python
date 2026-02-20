from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from CRUD import aprendices_create, aprendices_delete, aprendices_get, aprendices_update
import database

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    await database.startup()

@app.on_event("shutdown")
async def on_shutdown():
    await database.shutdown()

app.include_router(aprendices_get.Router)
app.include_router(aprendices_create.Router)
app.include_router(aprendices_delete.Router)
app.include_router(aprendices_update.Router)
