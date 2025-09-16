"use client";

import React from "react";
import { useFilters } from "@/hooks/useFilters";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Slider,
} from "@/components/ui/slider";
import { Loader2 } from "lucide-react";

export default function Filters() {
  const {
    orderByList,
    genderList,
    selectAge,
    selectGender,
    selectOrder,
    selectWithPhoto,
    filters,
    totalCount,
    isPending,
  } = useFilters();

  const { gender, ageRange, orderBy } = filters;

  return (
    <div className="shadow-md py-2">
      <div className="flex flex-row justify-around items-center flex-wrap gap-4">
        {/* Results */}
        <div className="flex gap-2 items-center">
          <div className="text-foreground font-semibold text-xl">
            Results:{" "}
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin inline" />
            ) : (
              totalCount
            )}
          </div>
        </div>

        {/* Gender filter */}
        <div className="flex gap-2 items-center">
          <div>Gender:</div>
          {genderList.map(({ icon: Icon, value }) => (
            <Button
              key={value}
              size="icon"
              variant={gender.includes(value) ? "default" : "outline"}
              onClick={() => selectGender(value)}
            >
              <Icon className="h-5 w-5" />
            </Button>
          ))}
        </div>

        {/* Age slider */}
        <div className="flex flex-col items-start gap-2 w-1/4 min-w-[200px]">
          <label className="text-sm font-medium">Age range</label>
          <Slider
            defaultValue={ageRange}
            min={18}
            max={100}
            step={1}
            onValueCommit={(value) => selectAge(value as number[])}
          />
          <div className="text-xs text-muted-foreground">
            {ageRange[0]} - {ageRange[1]}
          </div>
        </div>

        {/* With photo switch */}
        <div className="flex flex-col items-center">
          <p className="text-sm">With photo</p>
          <Switch
            checked={filters.withPhoto}
            onCheckedChange={selectWithPhoto}
          />
        </div>

        {/* Order by select */}
        <div className="w-1/4 min-w-[200px]">
          <Select
            value={orderBy}
            onValueChange={(value) => selectOrder(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Order by" />
            </SelectTrigger>
            <SelectContent>
              {orderByList.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
