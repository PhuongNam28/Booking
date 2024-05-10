"use client";
import qs from "query-string";
import { useEffect, useState } from "react";
import Container from "./Container";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import useLocation from "@/hooks/useLocation";
import { ICity, IState } from "country-state-city";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";

const LocationFlight = () => {
  const [fromCountry, setFromCountry] = useState("");
  const [toCountry, setToCountry] = useState("");
  const { getALlCountries } = useLocation();
  const countries = getALlCountries();
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    let currentQuery: any = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    if (fromCountry) {
      currentQuery = {
        ...currentQuery,
        fromCountry,
      };
    }

    if (toCountry) {
      currentQuery = {
        ...currentQuery,
        toCountry,
      };
    }

    const url = qs.stringifyUrl(
      {
        url: "/flight-list",
        query: currentQuery,
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
    //eslint-disable-next-line
  }, [fromCountry, toCountry]);

  const handleClear = () => {
    router.push("/trip-list");
    setFromCountry("");
    setToCountry("");
  };

  return (
    <Container>
      <div className="flex gap-2 md:gap-4 items-center justify-center text-sm">
        <div>
          <Select
            onValueChange={(value) => setFromCountry(value)}
            value={fromCountry}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="From Country" />
            </SelectTrigger>

            <SelectContent>
              {countries.map((country) => {
                return (
                  <SelectItem key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            onValueChange={(value) => setToCountry(value)}
            value={toCountry}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="To Country" />
            </SelectTrigger>

            <SelectContent>
              {countries.map((country) => {
                return (
                  <SelectItem key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => handleClear()} variant="outline">
          Clear Filters
        </Button>
      </div>
    </Container>
  );
};

export default LocationFlight;
