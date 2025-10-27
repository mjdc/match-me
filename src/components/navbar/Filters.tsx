"use client";

import React from "react";
import { useFilters } from "@/hooks/useFilters";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <div className="shadow-md py-4 px-4 lg:px-6 border-b bg-white/80 backdrop-blur">
      {/* Desktop layout */}
      <div className="hidden md:flex flex-row justify-around items-center">
        {/* Results */}
        <div className="flex items-center gap-2">
          <div className="text-slate-800 font-semibold text-xl">
            Results:{" "}
            {isPending ? (
              <Loader2 className="inline-block w-4 h-4 animate-spin text-muted-foreground" />
            ) : (
              totalCount
            )}
          </div>
        </div>

        {/* Gender */}
        <div className="flex gap-2 items-center">
          <span className="font-medium text-slate-700">Gender:</span>
          {genderList.map(({ icon: Icon, value }) => (
            <Button
              key={value}
              size="icon"
              variant={gender.includes(value) ? "default" : "outline"}
              onClick={() => selectGender(value)}
              className={`transition-all ${
                gender.includes(value)
                  ? "bg-pink-500 text-white hover:bg-pink-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon size={22} />
            </Button>
          ))}
        </div>

        {/* Age range */}
        <div className="flex flex-col items-center w-1/4">
          <span className="text-sm text-gray-700 mb-1 font-medium">
            Age range
          </span>
          <Slider
            defaultValue={ageRange}
            min={18}
            max={100}
            step={1}
            onValueCommit={(value) => selectAge(value)}
            className="w-full"
          />
        </div>

        {/* With photo */}
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-700 mb-1 font-medium">
            With photo
          </span>
          <Switch
            defaultChecked
            onCheckedChange={(checked) => selectWithPhoto(checked)}
          />
        </div>

        {/* Order by */}
        <div className="w-1/4">
          <Select
            value={orderBy}
            onValueChange={(value) => selectOrder(value)}
          >
            <SelectTrigger className="w-full">
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

      {/* Mobile layout */}
      <div className="md:hidden space-y-4">
        {/* Results + With photo */}
        <div className="flex justify-between items-center">
          <div className="text-slate-800 font-semibold text-lg">
            Results:{" "}
            {isPending ? (
              <Loader2 className="inline-block w-4 h-4 animate-spin text-muted-foreground" />
            ) : (
              totalCount
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">With photo</span>
            <Switch
              defaultChecked
              onCheckedChange={(checked) => selectWithPhoto(checked)}
            />
          </div>
        </div>

        {/* Gender + Order */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium text-gray-700">Gender:</span>
            {genderList.map(({ icon: Icon, value }) => (
              <Button
                key={value}
                size="icon"
                variant={gender.includes(value) ? "default" : "outline"}
                onClick={() => selectGender(value)}
                className={`transition-all ${
                  gender.includes(value)
                    ? "bg-pink-500 text-white hover:bg-pink-600"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />
              </Button>
            ))}
          </div>
          <div className="flex-1 max-w-[130px]">
            <Select
              value={orderBy}
              onValueChange={(value) => selectOrder(value)}
            >
              <SelectTrigger className="w-full">
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

        {/* Age range */}
        <div className="px-2">
          <span className="text-sm text-gray-700 mb-1 font-medium">
            Age range
          </span>
          <Slider
            defaultValue={ageRange}
            min={18}
            max={100}
            step={1}
            onValueCommit={(value) => selectAge(value)}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
}
