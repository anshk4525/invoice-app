export function FormatCurrency(amount: number, selectedCurrency: string = "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: selectedCurrency,
    }).format(amount);
  }