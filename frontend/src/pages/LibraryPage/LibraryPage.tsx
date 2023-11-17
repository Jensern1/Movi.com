import { Link, useNavigate, useParams } from "react-router-dom";
import "./LibraryPage.css";
import PageFooter from "../../components/pageFooter/PageFooter";
import { ArrowCircleLeftBlack } from "../../assets/icons/ArrowCircleLeftBlack";
import { useMoviesInByLibraryIDQuery } from "../../../src/services/getMovies.ts";
import { useRemoveMovieFromFavorites } from "../../../src/services/removeMovieFromFavorites.ts";
import { useAuth } from "../../services/auth/AuthContext.tsx";
import ClearIcon from "@mui/icons-material/Clear";

/**
 * Render the RegisterPage component.
 * @returns {React.FC}
 */
const LibraryPage: React.FC = () => {
  // State definitions
  const { libraryProp } = useParams();

  // Set libraryID and libraryName
  let libraryID: string = "";
  let libraryName: string = "";
  if (libraryProp) {
    [libraryID, libraryName] = libraryProp.split(":");
  }

  console.log(libraryID);

  // Hooks for fetching movies and navigation
  const { userID } = useAuth();
  const { data: movies } = useMoviesInByLibraryIDQuery(libraryID, userID);
  const { mutate } = useRemoveMovieFromFavorites(userID);
  const navigate = useNavigate();

  /**
   * Formats a number to a two-digit string (e.g., 1 becomes "01").
   */
  const formatNumber = (number: number) => {
    return number < 10 ? `0${number}` : number.toString();
  };

  /**
   * Handles the delete user.
   */
  const handleDelete = (imdbID: string) => {
    mutate(imdbID);
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
        <div className="library-title">
          <div className="text-wrapper">{libraryName}</div>
        </div>

        {/* Movie list headers */}
        <div className="column-info">
          <div className="invisible">01</div>
          <div className="group">
            <div className="text-wrapper">Title</div>
            <div className="div">Rating</div>
            <div className="text-wrapper-2">Length</div>
          </div>
        </div>

        {/* Display list of movies */}
        {movies &&
          movies.map((movie, index) => (
            <div key={movie.imdbID} className="list-row">
              <Link to={"/movie/" + movie.imdbID}>
                <div className="text-wrapper">{formatNumber(index + 1)}</div>
                <div className="group">
                  <div className="div">{movie.primaryTitle}</div>
                  <div className="text-wrapper-2">{movie.averageRating}</div>
                  <div className="text-wrapper-3">
                    {movie.runtimeMinutes} Minutes
                  </div>
                </div>
              </Link>
              {/* Clear icon as delete button */}
              <ClearIcon
                onClick={(e) => {
                  e.stopPropagation(); // Prevents link activation
                  handleDelete(movie.imdbID);
                }}
                style={{
                  cursor: "pointer",
                  opacity: 1,
                  fontSize: "3em",
                }}
              />
            </div>
          ))}
      </div>

      {/* Footer component */}
      <div>
        <PageFooter></PageFooter>
      </div>
    </>
  );
};

export default LibraryPage;
