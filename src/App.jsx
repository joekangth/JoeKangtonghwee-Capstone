import "./App.css";
import StockForm from "./components/StockForm";
import StockList from "./components/StockList";
import { useStocks } from "./context/StockContext";

export default function App() {
  const { globalError } = useStocks();

  return (
    <div className="page">
      <div className="card">
        <h1>Finance Dashboard</h1>

        <StockForm />

        {globalError && <p className="error center">{globalError}</p>}

        <h2 className="section-title">Stock List</h2>
        <StockList />
      </div>
    </div>
  );
}
