// ClientCurrencySelector.tsx
"use client";

import React, { useState } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { currencies } from "../utils/currencies";

interface CurrencySelectorProps {
  onCurrencyChange: (currency: string) => void;
}

const ClientCurrencySelector: React.FC<CurrencySelectorProps> = ({ onCurrencyChange }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
    onCurrencyChange(value);  // Passing the new currency to parent component
  };

  return (
    <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a currency">
          {currencies.find((c) => c.code === selectedCurrency)?.name || "USD"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            {currency.name} ({currency.symbol})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ClientCurrencySelector;
