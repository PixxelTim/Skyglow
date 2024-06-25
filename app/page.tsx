"use client";
import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig } from "axios";
import Search from "./components/search/search";
import CurrentWeather from "./components/weather/currentWeather";

interface SearchData {
  value: string;
  label: string;
}

interface WeatherData {
  city: string;
  weather: { icon: string; description: string }[];
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: { speed: number };
}

export default function Page() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );

  const handleOnSearchChange = (searchData: SearchData) => {
    console.log(searchData);
    const [lat, lon] = searchData.value.split(" ");
    getWeather(lat, lon, searchData);
  };

  const getWeather = async (
    lat: string,
    lon: string,
    searchData: SearchData
  ) => {
    const options: AxiosRequestConfig = {
      method: "GET",
      url: `https://open-weather13.p.rapidapi.com/city/latlon/${lat}/${lon}`,
      headers: {
        "x-rapidapi-key": `${process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY}`,
        "x-rapidapi-host": "open-weather13.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      setCurrentWeather({ city: searchData.label, ...response.data });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (currentWeather) {
      console.log(currentWeather);
    }
  }, [currentWeather]);

  return (
    <div className="flex justify-center items-center h-screen flex-col bg-black text-white">
      <h2 className="font-raleway text-5xl font-extrabold mb-10 sm:text-4xl">
        Skyglow
      </h2>
      <div className="flex flex-col gap-4 items-stretch">
        <Search onSearchChange={handleOnSearchChange} />
        {currentWeather && <CurrentWeather data={currentWeather} />}
      </div>
    </div>
  );
}
