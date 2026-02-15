
from fastapi import FastAPI, HTTPException
import asyncpg
import os
from pydantic import BaseModel, EmailStr

app = FastAPI()

SENA_HOST = "aws-0-us-west-2.pooler.supabase.com"
SENA_USER = "postgres.vcfbzwteaodlznqppqyq"
SENA_PWD = "DWzaWsmg7dxSxMKy"

class AprendizCreate(BaseModel):
    nombre: str
    correo: EmailStr
    edad: int

DB_CONFIG = {
    "host": SENA_HOST,  
    "port": 6543,
    "database": "postgres",
    "user": SENA_USER,
    "password": SENA_PWD,
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
        row = await conn.fetchrow(
            """
            INSERT INTO public.adso_nocturno (nombre, correo, edad)
            VALUES ($1, $2, $3)
            RETURNING id, nombre, correo, edad;
            """, aprendiz.nombre, aprendiz.correo, aprendiz.edad)

        return dict(row)    
    
@app.delete("/aprendices/{id}", status_code=204)
async def delete_aprendiz(id: int):
    async with pool.acquire() as conn:
        deletion = await conn.execute(
            """
            DELETE FROM public.adso_nocturno WHERE id = $1; 
            """, id)
        
        if deletion == "DELETE 0":
            raise HTTPException(status_code=404, detail="Aprendiz no encontrado")
        
@app.put("/aprendices/{id}")
async def update_all_aprendiz(id: int, new_name: str, new_email: EmailStr, new_age: int):
    async with pool.acquire() as conn:
        full_update = await conn.fetchrow(
            """
            UPDATE public.adso_nocturno
            SET nombre = $1,
            correo = $2,
            edad = $3
            WHERE id = $4
            RETURNING *;
            """, new_name, new_email, new_age , id
        )

    if full_update is None:
        raise HTTPException(status_code=404, detail="Aprendiz no encontrado")
    
    return dict(full_update)

    

@app.patch("/aprendices_name/{id}")
async def update_aprendiz_name(id: int, new_name: str):
    async with pool.acquire() as conn:
        name_update = await conn.fetchrow(
            """
            UPDATE public.adso_nocturno
            SET nombre = $1
            WHERE id = $2
            RETURNING id, nombre;
            """, new_name, id
        )

    if name_update is None:
        raise HTTPException(status_code=404, detail="Aprendiz no encontrado")
    
    return dict(name_update)
################################################
@app.patch("/aprendices_email/{id}")
async def update_aprendiz_email(id: int, new_email: EmailStr):
    async with pool.acquire() as conn:
        email_update = await conn.fetchrow(
            """
            UPDATE public.adso_nocturno
            SET correo = $1
            WHERE id = $2
            RETURNING id, nombre, correo;
            """, new_email, id
        )

    if email_update is None:
        raise HTTPException(status_code=404, detail="Aprendiz no encontrado")
    
    return dict(email_update)

@app.patch("/aprendices_age/{id}")
async def update_aprendiz_age(id: int, new_age: int):
    async with pool.acquire() as conn:
        email_update = await conn.fetchrow(
            """
            UPDATE public.adso_nocturno
            SET edad = $1
            WHERE id = $2
            RETURNING id, nombre, edad;
            """, new_age, id
        )

    if email_update is None:
        raise HTTPException(status_code=404, detail="Aprendiz no encontrado")
    
    return dict(email_update)