import { useState } from "react";
import axios from "axios";
import axiosRetry from "axios-retry";

const Search = ({
  onSearchChange,
}: {
  onSearchChange: (value: any) => void;
}) => {
  const [search, setSearch] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  axiosRetry(axios, { retries: 3 });

  const loadOptions = async (inputValue: string) => {
    const options = {
      method: "GET",
      url: "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
      params: {
        namePrefix: `${inputValue}`,
        languageCode: "DE",
        minPopulation: "10000",
      },
      headers: {
        "x-rapidapi-key": `${process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY}`,
        "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      //const response = { data: { data: cities } };

      const searchTerms = inputValue
        .split(",")
        .map((term) => term.trim().toLowerCase());

      const filteredSuggestions = response.data.data
        .filter((city) => {
          const cityStringParts = [
            city.name.toLowerCase(),
            city.regionCode.toLowerCase(),
            city.countryCode.toLowerCase(),
          ];
          return searchTerms.every((term) =>
            cityStringParts.some((part) => part.includes(term))
          );
        })
        .map((city) => ({
          value: `${city.latitude} ${city.longitude}`,
          label: `${city.name}, ${city.regionCode}, ${city.countryCode}`,
        }));

      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnChange = (event) => {
    const searchData = event.target.value;
    setSearch(searchData);
    setSelectedValue(null);
    debounce(() => loadOptions(searchData), 600)();
  };

  const handleSelection = (event) => {
    const selectedOption = suggestions.find(
      (option) => option.label === event.target.value
    );
    if (selectedOption) {
      setSelectedValue(selectedOption.value);
      onSearchChange(selectedOption);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedValue) {
      onSearchChange(
        suggestions.find((suggestion) => suggestion.value === selectedValue)
      );
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={handleOnChange}
          onBlur={handleSelection}
          placeholder="Search..."
          list="cities"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <datalist id="cities">
          {suggestions.map((city, index) => (
            <option key={`${city.value}-${index}`} value={city.label} />
          ))}
        </datalist>
        <input
          type="submit"
          value="Senden"
          onClick={handleSubmit}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        />
      </div>
    </div>
  );
};

export default Search;
