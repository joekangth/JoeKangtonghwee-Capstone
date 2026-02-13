import { useStocks } from "../context/StockContext";

function StockList() {
  const { stocks } = useStocks();

  if (stocks.length === 0) {
    return <p className="empty">No stocks added yet.</p>;
  }

  return (
    <div className="stock-list">
      {stocks.map((stock) => {
        const isReady = stock.status === "ready";
        const isLoading = stock.status === "loading";
        const isError = stock.status === "error";

        const pnlIsPositive = isReady && stock.profitLoss >= 0;

        return (
          <div className="stock-card" key={stock.id}>
            {/* TOP ROW */}
            <div className="stock-header">
              <div className="ticker">{stock.symbol}</div>

              {isReady && (
                <div className={pnlIsPositive ? "pnl positive" : "pnl negative"}>
                  {pnlIsPositive ? "+" : "-"}$
                  {Math.abs(stock.profitLoss).toFixed(2)}
                </div>
              )}
            </div>

            {/* DETAILS GRID */}
            <div className="grid">
              <div className="row">
                <span className="label">Quantity</span>
                <span className="value">{stock.quantity}</span>
              </div>

              <div className="row">
                <span className="label">Purchase Price</span>
                <span className="value">
                  ${Number(stock.purchasePrice).toFixed(2)}
                </span>
              </div>

              {isReady && (
                <div className="row">
                  <span className="label">Current Price</span>
                  <span className="value">
                    ${Number(stock.currentPrice).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {isLoading && <p className="muted">Fetching current price…</p>}
            {isError && <p className="error">{stock.errorMsg}</p>}
          </div>
        );
      })}
    </div>
  );
}

export default StockList;
