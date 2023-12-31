import { Link, useNavigate, useParams } from "react-router-dom";
import "./LibraryPage.css";
import PageFooter from "../../components/pageFooter/PageFooter";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { ArrowCircleLeftBlack } from "../../assets/icons/ArrowCircleLeftBlack";
import { useMoviesInByLibraryIDQuery } from "../../../src/services/getMovies.ts";
import { useRemoveMovieFromFavorites } from "../../../src/services/removeMovieFromFavorites.ts";
import { useRemoveMovieFromLibrary } from "../../../src/services/removeMovieFromLibrary.ts";
import { useAuth } from "../../services/auth/AuthContext.tsx";
import ClearIcon from "@mui/icons-material/Clear";
import empty_library from "../../assets/images/empty_library.png";
import { useEffect, useState } from "react";
import { useRemoveLibrary } from "../../services/removeLibrary.ts";
import { effect } from "@preact/signals-react";
import { navbarColor } from "../../App.tsx";
import { useUserFavoritesQuery } from "../../services/getUserFavorites.ts";
import { MovieContent } from "../../interfaces.ts";

/**
 * LibraryPage Component
 *
 * This component displays the content of a specific library identified by a library ID.
 * It lists all movies in the library, and provides options to both to delete individual movies as well as the entire library,
 * and features navigation back to the previous page through a back-button in the top left corner.
 *
 * Features:
 * - Displays a list of movies from a specific library, each with title, rating, runtime, and a delete option.
 * - Implements a dialog for confirming the deletion of the entire library.
 * - Offers a back-button to return to the previous page.
 * - Provides an option to navigate to the main page to add more movies if the library is empty.
 * - Utilizes `useMoviesInByLibraryIDQuery`, `useRemoveMovieFromFavorites`, and `useRemoveMovieFromLibrary` hooks for fetching and modifying library content.
 * - Uses `useAuth` for user authentication and `useNavigate` for navigation.
 * - Includes the `PageFooter` component for consistent page layout across pages.
 * - Navbar color is dynamically set to black using `navbarColor` signal.
 * - Renders a `ClearIcon` from Material-UI for each movie for the deletion option.
 * - Utilizes Material-UI components for dialog, buttons, and layout.
 */
const LibraryPage: React.FC = () => {
  // State definitions
  const { libraryProp } = useParams();
  const [libraryMovies, setLibraryMovies] = useState<MovieContent[] | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Set libraryID and libraryName
  let libraryID: string = "";
  let libraryName: string = "";
  if (libraryProp) {
    [libraryID, libraryName] = libraryProp.split(":");
  }

  // Hooks for fetching movies and navigation
  const { userID } = useAuth();
  const { data: favorites } = useUserFavoritesQuery(userID);
  const { data: movies } = useMoviesInByLibraryIDQuery(libraryID, userID);
  const { mutate: mutateFavorites } = useRemoveMovieFromFavorites(userID);
  const { mutate: mutateLibrary } = useRemoveMovieFromLibrary(
    userID,
    libraryID
  );
  const { mutate: removeLibrary } = useRemoveLibrary(userID, libraryID);
  const navigate = useNavigate();

  useEffect(() => {
    if (movies && libraryID !== "favorites") {
      setLibraryMovies(movies);
    } else if (favorites && libraryID === "favorites") {
      setLibraryMovies(favorites);
    }
  }, [favorites, libraryID, movies]);

  effect(() => {
    navbarColor.value = "black";
  });

  /**
   * Formats a number to a two-digit string (e.g., 1 becomes "01").
   */
  const formatNumber = (number: number) => {
    return number < 10 ? `0${number}` : number.toString();
  };

  // Form dialog that makes sure that user wants to delete entire library
  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  /**
   * Deletes the library.
   */
  const confirmDeleteLibrary = () => {
    removeLibrary();
    navigate("/my-library");
    closeDeleteDialog();
  };

  // Delete movie from library==========================================================================
  /**
   * Handle deletion of a movie from a library.
   */
  const handleDelete = (imdbID: string) => {
    // Check if it is the favorites library.

    if (libraryID === "favorites") {
      mutateFavorites(imdbID);
    } else {
      mutateLibrary(imdbID);
    }
  };

  // Return =============================================================
  return (
    <>
      <div className="LibraryPage">
        {/* Back navigation button */}
        <div className="back-button-container">
          <button className="back-button-library" onClick={() => navigate(-1)}>
            <ArrowCircleLeftBlack />
          </button>
        </div>

        {/* Display library title */}
        {libraryID !== "favorites" && (
          <div className="library-title">
            <div className="text-wrapper">{libraryName}</div>
            <div className="delete-library-button">
              <button
                className="delete-library-button-text"
                onClick={openDeleteDialog}
              >
                Delete Library
              </button>
            </div>
          </div>
        )}

        {/* Display list of movies */}
        {!libraryMovies || libraryMovies.length === 0 ? (
          <div className="empty-library-container">
            <img
              className="image"
              alt="Empty library image"
              src={empty_library}
            />
            <p className="no-movies-found">No Movies Found In This Library</p>
            <button className="div-wrapper" onClick={() => navigate("../../")}>
              <div className="text-wrapper">Add Movies</div>
            </button>
          </div>
        ) : (
          <div style={{ margin: "auto" }}>
            {/* Movie list headers */}
            <div className="column-info">
              <div className="group">
                <div className="text-wrapper">Title</div>
                <div className="div">Rating</div>
                <div className="text-wrapper-2">Length</div>
                <div className="text-wrapper-3">Delete</div>
              </div>
            </div>

            {libraryMovies &&
              Array.isArray(libraryMovies) &&
              libraryMovies.map((movie, index) => (
                <div key={movie.imdbID} className="list-row">
                  <Link to={"/movie/" + movie.imdbID}>
                    <div className="group">
                      <div className="text-wrapper">
                        {formatNumber(index + 1)}
                      </div>
                      <div className="div">{movie.primaryTitle}</div>
                      <div className="text-wrapper-2">
                        {movie.averageRating}
                      </div>
                      <div className="text-wrapper-3">
                        {movie.runtimeMinutes} Minutes
                      </div>
                      <ClearIcon
                        data-testid={`delete-movie-${movie.imdbID}`}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents link activation
                          e.preventDefault(); // Prevents link activation
                          handleDelete(movie.imdbID);
                        }}
                        style={{
                          cursor: "pointer",
                          opacity: 1,
                          fontSize: "3em",
                          position: "absolute",
                          right: 0,
                          color: "red",
                          zIndex: 10,
                        }}
                      />
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Footer component */}
      <div
        style={{
          position: "relative",
          bottom: 0,
          width: "100%",
        }}
      >
        <PageFooter></PageFooter>
      </div>
      <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Delete Library</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this library? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button
            onClick={confirmDeleteLibrary}
            style={{ backgroundColor: "red", color: "white" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LibraryPage;
