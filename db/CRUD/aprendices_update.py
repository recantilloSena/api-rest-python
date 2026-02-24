from pydantic import EmailStr
from fastapi import HTTPException
import database as db
from database import Router

@Router.put("/aprendices/{id}")
async def update_all_aprendiz(id: int, new_name: str, new_age: int):
    async with db.pool.acquire() as conn:
        full_update = await conn.fetchrow(
            """
            UPDATE public.aprendices
            SET nombres = $1,
            edad = $2
            WHERE id = $3
            RETURNING *;
            """, new_name, new_age , id
        )

    if full_update is None:
        raise HTTPException(status_code=404, detail="Aprendiz no encontrado")
    
    return dict(full_update)

################################################

@Router.patch("/aprendices_name/{id}")
async def update_aprendiz_name(id: int, new_name: str):
    async with db.pool.acquire() as conn:
        name_update = await conn.fetchrow(
            """
            UPDATE public.aprendices
            SET nombres = $1
            WHERE id = $2
            RETURNING id, nombres;
            """, new_name, id
        )

    if name_update is None:
        raise HTTPException(status_code=404, detail="Aprendiz no encontrado")
    
    return dict(name_update)

################################################
'''

@Router.patch("/aprendices_email/{id}")
async def update_aprendiz_email(id: int, new_email: EmailStr):
    async with db.pool.acquire() as conn:
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
'''

################################################

@Router.patch("/aprendices_age/{id}")
async def update_aprendiz_age(id: int, new_age: int):
    async with db.pool.acquire() as conn:
        email_update = await conn.fetchrow(
            """
            UPDATE public.aprendices
            SET edad = $1
            WHERE id = $2
            RETURNING id, nombres, edad;
            """, new_age, id
        )

    if email_update is None:
        raise HTTPException(status_code=404, detail="Aprendiz no encontrado")
    
    return dict(email_update)