from pydantic import BaseModel, EmailStr
import database as db
from database import Router


class AprendizCreate(BaseModel):
    nombre: str
    edad: int

@Router.post("/aprendices", status_code=201)
async def create_aprendiz(aprendiz: AprendizCreate):
    async with db.pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO public.aprendices (nombres, edad)
            VALUES ($1, $2)
            RETURNING id, nombres, edad;
            """, aprendiz.nombre, aprendiz.edad)

        return dict(row)