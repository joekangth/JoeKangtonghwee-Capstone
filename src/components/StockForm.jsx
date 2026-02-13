import { useState } from "react";
import { useStocks } from "../context/StockContext";

function StockForm() {
  const { addStock, loading } = useStocks();

  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!symbol || !quantity || !purchasePrice) return;

    addStock({
      symbol: symbol.toUpperCase().trim(),
      quantity: parseFloat(quantity),
      purchasePrice: parseFloat(purchasePrice),
    });

    setSymbol("");
    setQuantity("");
    setPurchasePrice("");
  };

  return (
    <form onSubmit={handleSubmit} className="stock-form">
      <div className="input">
        <input
          type="text"
          placeholder="Stock Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
      </div>

      <div className="input">
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="0"
          step="1"
        />
      </div>

      <div className="input hasPrefix">
        <span className="prefix">$</span>
        <input
          type="number"
          placeholder="Purchase Price"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
          min="0"
          step="0.01"
        />
      </div>

      <button className="btn" type="submit" disabled={loading}>
        {loading ? "Loading..." : "Add Stock"}
      </button>
    </form>
  );
}

export default StockForm;
