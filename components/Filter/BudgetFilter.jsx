import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { t } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";

const BudgetFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [budget, setBudget] = useState({
    minPrice: searchParams.get("min_price") || "",
    maxPrice: searchParams.get("max_price") || "",
  });

  const { minPrice, maxPrice } = budget;

  const handleMinMaxPrice = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("min_price", minPrice);
    newSearchParams.set("max_price", maxPrice);
    router.push(`/ads?${newSearchParams.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <form className="flex gap-4">
        <Input
          type="number"
          placeholder={t("from")}
          min={0}
          onChange={(e) =>
            setBudget((prev) => ({ ...prev, minPrice: e.target.value }))
          }
          value={minPrice}
        />
        <Input
          type="number"
          placeholder={t("to")}
          min={0}
          onChange={(e) =>
            setBudget((prev) => ({ ...prev, maxPrice: e.target.value }))
          }
          value={maxPrice}
        />
      </form>
      <Button
        type="submit"
        className="hover:bg-primary hover:text-white"
        variant="outline"
        disabled={
          !minPrice || !maxPrice || minPrice > maxPrice || minPrice == maxPrice
        }
        onClick={handleMinMaxPrice}
      >
        {t("apply")}
      </Button>
    </div>
  );
};

export default BudgetFilter;
