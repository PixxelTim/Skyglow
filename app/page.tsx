"use client";

import { useState } from "react";
import axios from "axios";

export default function Page() {
  const [city, setCity] = useState<string>("");
  const [temp, setTemp] = useState<number | null>(null);
  const [minTemp, setMinTemp] = useState<number | null>(null);
  const [maxTemp, setMaxTemp] = useState<number | null>(null);
  const [sunrise, setSunrise] = useState<string>("");
  const [sunset, setSunset] = useState<string>("");
  const [err, setErr] = useState<boolean>(false);

  const getWeather = () => {
    setErr(false);
    setTemp(null);

    const options = {
      method: "GET",
      url: `https://open-weather13.p.rapidapi.com/city/${city}/DE`,
      headers: {
        "x-rapidapi-key": `${process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY}`,
        "x-rapidapi-host": "open-weather13.p.rapidapi.com",
      },
    };

    const fahrenheitToCelsius = (fahrenheit: number) => {
      return (fahrenheit - 32) * (5 / 9);
    };

    const formatTime = (time: string): string => {
      const parts = time.split(":");
      return parts.slice(0, 2).join(":");
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        const { data } = response;
        const newTemp = Number(fahrenheitToCelsius(data.main.temp).toFixed(1));
        const newMinTemp = Number(
          fahrenheitToCelsius(data.main.temp_min).toFixed(1)
        );
        const newMaxTemp = Number(
          fahrenheitToCelsius(data.main.temp_max).toFixed(1)
        );
        const newSunrise = new Date(data.sys.sunrise * 1000);
        const newSunSet = new Date(data.sys.sunset * 1000);

        setTemp(newTemp);
        setMinTemp(newMinTemp);
        setMaxTemp(newMaxTemp);
        setSunrise(formatTime(newSunrise.toLocaleTimeString()));
        setSunset(formatTime(newSunSet.toLocaleTimeString()));
      })
      .catch(function (error) {
        setErr(true);
      });
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col bg-black text-white">
      <h2 className="font-raleway text-5xl font-extrabold mb-10 sm:text-4xl">
        Skyglow
      </h2>
      <div className="flex gap-4 items-stretch">
        <input
          type="text"
          placeholder="Stadt..."
          className="bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-lg focus:ring-slate-500 focus:border-slate-500 block w-full p-2.5"
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          onClick={getWeather}
          className="text-slate-100 bg-slate-700 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Suchen
        </button>
      </div>
      {temp && (
        <div className="mt-10 flex flex-col justify-start bg-slate-950 px-12 py-4 rounded-lg font-raleway text-xl font-semibold text-slate-300 sm:text-base sm:px-8">
          <div className="flex mb-4">
            <p className="w-64 sm:w-41">Standort:</p>
            <p>{city}</p>
          </div>
          <div className="flex mb-4">
            <p className="w-64 sm:w-41">Aktuell:</p>
            <p>{temp} ° C</p>
          </div>
          <div className="flex mb-4">
            <p className="w-64 sm:w-41">Min:</p>
            <p>{minTemp}° C</p>
          </div>
          <div className="flex mb-4">
            <p className="w-64 sm:w-41">Max:</p>
            <p>{maxTemp}° C</p>
          </div>
          <div className="flex mb-4">
            <p className="w-64 sm:w-41">Sonnenaufgang:</p>
            <p>{sunrise} Uhr</p>
          </div>
          <div className="flex">
            <p className="w-64 sm:w-41">Sonnenuntergang:</p>
            <p>{sunset} Uhr</p>
          </div>
        </div>
      )}
      {err && (
        <div className="mt-10 bg-red-200 px-12 py-4 rounded font-raleway text-xl font-semibold text-gray-700 sm:text-base sm:px-8">
          <p>Beim Abrufen von Wetterdaten ist ein Fehler aufgetreten.</p>
        </div>
      )}
    </div>
  );
}
