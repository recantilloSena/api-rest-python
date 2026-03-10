from fastapi import HTTPException
import database as db
from database import Router



@Router.get("/aprendices")
async def get_aprendices():
    async with db.pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT id, nombres, edad
            FROM public.aprendices;
        """)

        # asyncpg devuelve Record → convertir a dict
        return [dict(row) for row in rows]


@Router.get("/aprendices/{id}")
async def get_apendiz_by_id(id: int):
    async with db.pool.acquire() as conn:
        row = await conn.fetchrow("""
            SELECT id, nombres, edad
            FROM public.aprendices
            WHERE id = $1;
        """, id)

        if not row:
            raise HTTPException(status_code=404, detail="Aprendiz no encontrado")

        return dict(row)