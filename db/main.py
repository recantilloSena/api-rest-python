from fastapi import FastAPI, HTTPException
import asyncpg
import os
from pydantic import BaseModel, EmailStr

app = FastAPI()

class AprendizCreate(BaseModel):
    nombre: str
    correo: EmailStr
    edad: int

DB_CONFIG = {
    "host": os.getenv("SENA_HOST"),  
    "port": 6543,
    "database": "postgres",
    "user": os.getenv("SENA_USER"),
    "password": os.getenv("SENA_PWD"),
    "ssl": "require",
}

pool: asyncpg.Pool | None = None


@app.on_event("startup")
async def startup():
    global pool
    pool = await asyncpg.create_pool(
        host=DB_CONFIG["host"],
        port=DB_CONFIG["port"],
        database=DB_CONFIG["database"],
        user=DB_CONFIG["user"],
        password=DB_CONFIG["password"],
        ssl=DB_CONFIG["ssl"],
        min_size=1,
        max_size=5,
        statement_cache_size =0
    )


@app.on_event("shutdown")
async def shutdown():
    await pool.close()


@app.get("/aprendices")
async def get_aprendices():
    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT id, nombre, correo, edad
            FROM public.adso_nocturno;
        """)

        # asyncpg devuelve Record → convertir a dict
        return [dict(row) for row in rows]


@app.get("/aprendices/{id}")
async def get_apendiz_by_id(id: int):
    async with pool.acquire() as conn:
        row = await conn.fetchrow("""
            SELECT id, nombre, correo, edad
            FROM public.adso_nocturno
            WHERE id = $1;
        """, id)

        if not row:
            raise HTTPException(status_code=404, detail="Aprendiz no encontrado")

        return dict(row)
    
@app.post("/aprendices", status_code=201)
async def create_aprendiz(aprendiz: AprendizCreate):
    async with pool.acquire() as conn:
        row = await conn.fetchrow("""
            INSERT INTO public.adso_nocturno (nombre, correo, edad)
            VALUES ($1, $2, $3)
            RETURNING id, nombre, correo, edad;
        """, aprendiz.nombre, aprendiz.correo, aprendiz.edad)

        return dict(row)    