import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

export default function ExpenseTracker() {
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [classification, setClassification] = useState("");
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/get_summary/");
      setSummary(response.data);
    } catch (error) {
      console.error("Erro ao buscar resumo", error);
    }
  };

  const addExpense = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/add_expense/", {
        date,
        category,
        description,
        amount: parseFloat(amount),
        payment_method: paymentMethod,
        classification,
      });
      fetchSummary();
    } catch (error) {
      console.error("Erro ao adicionar despesa", error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card className="p-4 mb-4">
        <h2 className="text-xl font-bold mb-2">Adicionar Despesa</h2>
        <Input placeholder="Data (YYYY-MM-DD)" value={date} onChange={(e) => setDate(e.target.value)} className="mb-2" />
        <Input placeholder="Categoria" value={category} onChange={(e) => setCategory(e.target.value)} className="mb-2" />
        <Input placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} className="mb-2" />
        <Input placeholder="Valor" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="mb-2" />
        <Input placeholder="Forma de pagamento" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="mb-2" />
        <Input placeholder="Classificação" value={classification} onChange={(e) => setClassification(e.target.value)} className="mb-2" />
        <Button onClick={addExpense}>Adicionar</Button>
      </Card>

      <Card className="p-4">
        <h2 className="text-xl font-bold mb-2">Resumo Mensal</h2>
        {summary.map((item, index) => (
          <CardContent key={index} className="p-2 border-b">
            <p><strong>{item.DATA}</strong>: R$ {item.VALOR.toFixed(2)}</p>
          </CardContent>
        ))}
      </Card>
    </div>
  );
}
