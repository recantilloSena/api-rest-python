from pydantic import BaseModel, EmailStr
import database as db
from database import Router


class AprendizCreate(BaseModel):
    nombre: str
    correo: EmailStr
    edad: int

@Router.post("/aprendices", status_code=201)
async def create_aprendiz(aprendiz: AprendizCreate):
    async with db.pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO public.adso_nocturno (nombre, correo, edad)
            VALUES ($1, $2, $3)
            RETURNING id, nombre, correo, edad;
            """, aprendiz.nombre, aprendiz.correo, aprendiz.edad)

        return dict(row)