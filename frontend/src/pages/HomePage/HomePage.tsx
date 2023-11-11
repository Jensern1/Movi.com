import { useEffect, useState } from "react";
import { CurrentFilter, Movie, MovieContent, User } from "../../interfaces";

import MovieContainerGrid from "../../components/movieContainerGrid/MovieContainerGrid";
import "./HomePage.css";
import { useAuth } from "../../services/auth/AuthContext";

import SearchBar from "../../components/searchBar/SearchBar";
// import SortMenu from "../../components/sortMenu/SortMenu";
import FilterMenu from "../../components/filterMenu/FilterMenu";

import headerImage from "./img.png";
import SortMenu from "../../components/sortMenu/SortMenu";
import HomePageHeader from "../../components/homePageHeader/HomePageHeader";
import PageFooter from "../../components/pageFooter/PageFooter";
import { MovieFilter, SortType } from "../../generated/graphql";
import NewsLetterBox from "../../components/newsletterBox/NewsLetterBox";

import { Signal, effect, signal } from "@preact/signals-react";
import { navbarColor } from "../../App";
import { useMovies } from "../../services/getMovies";
import { TablePagination } from "@mui/material";

interface FilterSettings {
  releaseYearRange: { max: number; min: number };
  runtimeMinutesRange: { max: number; min: number };
  averageRatingRange: { max: number; min: number };
  totalVotesRange: { max: number; min: number };
  genres: string[];
  isAdult: boolean;
}

//Signals that contain the selected filters from the FilterSideBar-component
export const filterSignals = signal<FilterSettings>({
  releaseYearRange: { max: 2023, min: 1900 },
  runtimeMinutesRange: { max: 300, min: 0 },
  averageRatingRange: { max: 10, min: 0 },
  totalVotesRange: { max: 1000000, min: 0 },
  genres: [],
  isAdult: false,
});

export const currentSearch = signal<string>("");

// export const currentSort = signal<SortType | null>(null);

/**
 * Render the HomePage component.
 * @returns {React.FC}
 */
const HomePage: React.FC = () => {
  const [originalMovies, setOriginalMovies] = useState<MovieContent[] | null>(
    null
  ); // All movies
  const [movies, setMovies] = useState<MovieContent[] | null>(null); // Movies that are actually displayed on the page (e.g. after filtering)
  // const [currentSearch, setCurrentSearch] = useState<string>("");
  const [currentSort, setCurrentSort] = useState<SortType | null>(null);
  const [currentFilter, setCurrentFilter] = useState<{
    isAdult?: boolean;
    genres?: string[];
  }>({ isAdult: false, genres: [] });

  //TODO: change to signal and set this to 0 when the filter, search or sort changes
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  console.log("FilterSignals =", filterSignals);

  const { data, isLoading } = useMovies(
    page,
    rowsPerPage,
    currentSearch.value,
    filterSignals.value as MovieFilter,
    currentSort as SortType
  );

  const { email } = useAuth();

  // Set color of text in Navbar to white
  effect(() => {
    navbarColor.value = "white";
  });

  // =======================================================================================================================

  useEffect(() => {
    console.log("Data =", data);
    if (data) {
      // Fetch the current user's favorites from localStorage
      setMovies(data.movies);
      setOriginalMovies(data.movies);
      console.log("Data has been set");
    }
  }, [data]);

  // Sorting==================================================================================================================

  const handleSort = (sortType: SortType) => {
    setCurrentSort(sortType); // Save the current sort type

    if (!movies) return;

    const sortedMovies = applySort(movies, sortType);
    setMovies(sortedMovies); // Cast sortedMovies to Movie[] type
  };

  const applySort = (
    movieList: MovieContent[],
    sortType: SortType
  ): MovieContent[] => {
    if (sortType === null) return originalMovies as Movie[];

    return [...movieList].sort((a: MovieContent, b: MovieContent): number => {
      switch (sortType) {
        case SortType.TitleAz:
          return a.primaryTitle.localeCompare(b.primaryTitle);
        case SortType.TitleZa:
          return b.primaryTitle.localeCompare(a.primaryTitle);
        case SortType.RatingHilo:
          return b.averageRating - a.averageRating;
        case SortType.RatingLohi:
          return a.averageRating - b.averageRating;
        case SortType.DurationHilo:
          return b.runtimeMinutes - a.runtimeMinutes;
        case SortType.DurationLohi:
          return a.runtimeMinutes - b.runtimeMinutes;
        case SortType.YearHilo:
          return b.startYear - a.startYear;
        case SortType.YearLohi:
          return a.startYear - b.startYear;
        default:
          return 0;
      }
    });
  };

  // Filtering=============================================================================================================

  const handleFilter = (filterTypeList: CurrentFilter) => {
    const newFilter = {
      isAdult: filterTypeList.isAdult,
      genres: filterTypeList.genres,
    };

    setCurrentFilter(newFilter);

    // If no filters are applied, reset the movies state to the original list
    if (
      !newFilter.isAdult &&
      (!newFilter.genres || newFilter.genres.length === 0)
    ) {
      setMovies(originalMovies);
      return;
    }

    // Apply filters and set the movies state
    if (originalMovies) {
      const filteredMovies = applyFilter(originalMovies, newFilter);
      setMovies(filteredMovies);
    }
  };

  // Apply the current filter to a list of movies
  const applyFilter = (
    movieList: MovieContent[],
    newFilter: CurrentFilter
  ): MovieContent[] => {
    return movieList.filter((movie) => {
      // Check isAdult filter
      if (
        newFilter.isAdult !== undefined &&
        movie.isAdult !== newFilter.isAdult
      ) {
        return false;
      }

      // Check genres filter
      if (newFilter.genres && newFilter.genres.length) {
        // Ensure all selected genres are present in the movie's genres list
        if (!newFilter.genres.every((genre) => movie.genres.includes(genre))) {
          return false;
        }
      }

      return true; // If neither the isAdult nor genres filter is active, include the movie
    });
  };

  // =======================================================================================================================

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="homePageContainer">
      <div>{filterSignals.value.genres}</div>
      <div className="pageContainer>">
        <div className="headerContainer">
          {originalMovies && (
            <HomePageHeader
              movies={originalMovies}
              onFilter={handleFilter}
            ></HomePageHeader>
          )}
        </div>
        <div className="contentContainer">
          {data && (
            <TablePagination
              className="pagination"
              component="div"
              count={data.count}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
          <div className="sortMenuContainer">
            <SortMenu
              onSort={(value) => handleSort(value as SortType)}
            ></SortMenu>
          </div>

          <div className="gridContainer">
            {movies?.length ? (
              <MovieContainerGrid movies={movies} />
            ) : (
              <h2 className="noMatchesText">No matches found</h2>
            )}
          </div>
          <div className="footerContainer">
            <NewsLetterBox></NewsLetterBox>
            <PageFooter></PageFooter>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
