import { createContext, useContext, useEffect, useState } from "react";

const StockContext = createContext(null);

export function StockProvider({ children }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add stock (initially set status to loading)
  const addStock = (newStock) => {
    setStocks((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...newStock,
        currentPrice: null,
        profitLoss: null,
        status: "loading",
        errorMsg: null,
      },
    ]);
  };

  useEffect(() => {
    const needsFetch = stocks.filter((s) => s.status === "loading");
    if (needsFetch.length === 0) return;

    const apiKey = import.meta.env.VITE_FINNHUB_KEY;

    const fetchPrices = async () => {
      setLoading(true);

      for (const stock of needsFetch) {
        try {
          const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=${apiKey}`
          );

          const data = await response.json();

          const currentPrice = data.c; // Finnhub current price

          if (!currentPrice || currentPrice === 0) {
            setStocks((prev) =>
              prev.map((x) =>
                x.id === stock.id
                  ? {
                      ...x,
                      status: "error",
                      errorMsg: "Invalid stock symbol.",
                    }
                  : x
              )
            );
            continue;
          }

          const profitLoss =
            (currentPrice - stock.purchasePrice) * stock.quantity;

          setStocks((prev) =>
            prev.map((x) =>
              x.id === stock.id
                ? {
                    ...x,
                    currentPrice,
                    profitLoss,
                    status: "ready",
                  }
                : x
            )
          );
        } catch (err) {
          setStocks((prev) =>
            prev.map((x) =>
              x.id === stock.id
                ? {
                    ...x,
                    status: "error",
                    errorMsg: "API error occurred.",
                  }
                : x
            )
          );
        }

        // small delay to avoid rate limits
        await new Promise((r) => setTimeout(r, 1000));
      }

      setLoading(false);
    };

    fetchPrices();
  }, [stocks]);

  return (
    <StockContext.Provider value={{ stocks, addStock, loading }}>
      {children}
    </StockContext.Provider>
  );
}

export function useStocks() {
  const ctx = useContext(StockContext);
  if (!ctx) throw new Error("useStocks must be used inside StockProvider");
  return ctx;
}
