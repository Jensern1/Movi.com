// FilterMenu.tsx
import React, { useState, useEffect, useRef, FC } from "react";
import "./FilterMenu.css";
import { Movie } from "../../interfaces";

interface FilterMenuProps {
  movies: Movie[] | [];
  onFilter: (filters: string[]) => void;
}

export interface CurrentFilter {
  isAdult?: boolean;
  genres?: string[];
}

const FilterMenu: FC<FilterMenuProps> = ({ movies = [], onFilter }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  // =======================================================================================================================

  // Find all the unique genres present in the movies array
  const uniqueGenres = Array.from(
    new Set(movies.flatMap((movie) => movie.genres))
  );

  // =======================================================================================================================

  // Make sure the modal closes when the users clicks outside of it
  const handleOutsideClick = (event: any) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // =======================================================================================================================

  // Update the currently selected filters
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedFilters((prev) => [...prev, event.target.value]);
    } else {
      setSelectedFilters((prev) =>
        prev.filter((filter) => filter !== event.target.value)
      );
    }
  };

  // =======================================================================================================================

  // Send filters to HomePage to handle actual filtering
  useEffect(() => {
    const filter: CurrentFilter = {};

    if (selectedFilters.includes("isAdult")) {
      filter.isAdult = true;
    }

    filter.genres = selectedFilters.filter((filter) => filter !== "isAdult");

    onFilter(filter);
  }, [selectedFilters]);

  // =======================================================================================================================

  return (
    <div className="filterMenuContainer">
      <button onClick={() => setShowModal(!showModal)}>🕊️test </button>
      {showModal && (
        <div className="filterModal" ref={modalRef}>
          <button onClick={() => setShowModal(false)} className="closeButton">
            X
          </button>
          <label>
            <input
              type="checkbox"
              value="isAdult"
              checked={selectedFilters.includes("isAdult")}
              onChange={handleFilterChange}
            />
            isAdult
          </label>
          {uniqueGenres.map((genre) => (
            <label key={genre}>
              <input
                type="checkbox"
                value={genre}
                checked={selectedFilters.includes(genre)}
                onChange={handleFilterChange}
              />
              {genre}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterMenu;
