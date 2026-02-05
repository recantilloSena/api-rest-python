from fastapi import FastAPI
import json

app = FastAPI()


@app.get("/list")
def get_list():
    nombres = ["Ana","Carlos","María","Juan","Laura"]    
    return {
        "data": [{"nombre": nombre} for nombre in nombres]
    }

@app.get("/add/{n}")
def add_list(n : str ):
    nombres = ["Ana","Carlos","María","Juan","Laura"] 
    nombres.append(n)
    return {
        "data": [{"nombre": nombre} for nombre in nombres]
    }