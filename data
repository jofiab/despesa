from fastapi import FastAPI, HTTPException
import pandas as pd
from datetime import datetime
import uvicorn

app = FastAPI()

FILE_PATH = "Personal.xlsx"

class ExpenseTracker:
    def __init__(self, file_path):
        self.file_path = file_path
        self.load_data()
    
    def load_data(self):
        self.expenses = pd.read_excel(self.file_path, sheet_name="Registo Despesas", skiprows=2)
        self.monthly_summary = pd.read_excel(self.file_path, sheet_name="Resumo_Meses")
        self.budget = pd.read_excel(self.file_path, sheet_name="Orçamento")
        self.fixed_expenses = pd.read_excel(self.file_path, sheet_name="FIXAS")
    
    def add_expense(self, date, category, description, amount, payment_method, classification):
        new_entry = pd.DataFrame({
            "DATA": [date],
            "TIPO": ["Despesa"],
            "GÉNERO": [category],
            "DESCRIÇÃO": [description],
            "VALOR": [amount],
            "FORMA": [payment_method],
            "CLASSIFICAÇÃO": [classification]
        })
        
        self.expenses = pd.concat([self.expenses, new_entry], ignore_index=True)
        self.update_summary()
    
    def update_summary(self):
        self.expenses["DATA"] = pd.to_datetime(self.expenses["DATA"], errors='coerce')
        self.expenses["VALOR"] = pd.to_numeric(self.expenses["VALOR"], errors='coerce')
        
        self.monthly_summary = self.expenses.groupby(self.expenses["DATA"].dt.strftime('%B'))["VALOR"].sum().reset_index()
    
    def save_to_excel(self):
        with pd.ExcelWriter(self.file_path, engine='xlsxwriter') as writer:
            self.expenses.to_excel(writer, sheet_name="Registo Despesas", index=False)
            self.monthly_summary.to_excel(writer, sheet_name="Resumo_Meses", index=False)
            self.budget.to_excel(writer, sheet_name="Orçamento", index=False)
            self.fixed_expenses.to_excel(writer, sheet_name="FIXAS", index=False)
        print("Arquivo atualizado com sucesso!")

tracker = ExpenseTracker(FILE_PATH)

@app.post("/add_expense/")
def add_expense(date: str, category: str, description: str, amount: float, payment_method: str, classification: str):
    try:
        tracker.add_expense(date, category, description, amount, payment_method, classification)
        tracker.save_to_excel()
        return {"message": "Despesa adicionada com sucesso!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get_summary/")
def get_summary():
    return tracker.monthly_summary.to_dict(orient="records")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
