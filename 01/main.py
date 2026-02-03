from typing import Union

from fastapi import FastAPI

app = FastAPI()


@app.get("/hola")
def read_root():
    return {"Hola": "mundo"}

@app.get("/hello")
def read_root():
    return {"Hello": "Word"}


@app.get("/sumar/{a}/{b}")
def sumar_service(a: int, b: int):
    return {"suma":  a + b}