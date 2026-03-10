from fastapi import HTTPException
import database as db
from database import Router



@Router.delete("/aprendices/{id}", status_code=204)
async def delete_aprendiz(id: int):
    async with db.pool.acquire() as conn:
        deletion = await conn.execute(
            """
            DELETE FROM public.aprendices WHERE id = $1; 
            """, id)
        
        if deletion == "DELETE 0":
            raise HTTPException(status_code=404, detail="Aprendiz no encontrado")