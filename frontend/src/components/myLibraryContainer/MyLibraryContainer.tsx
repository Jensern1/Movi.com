import { useEffect, useState } from "react";
import { Library } from "../../interfaces";
import { getMovieById } from "../../services/movieAPI";
import "./MyLibraryContainer.css";

import { AddLibraryIcon } from "../../assets/icons/AddLibraryIcon";

interface MyLibraryProps {
  library: Library;
}

const MyLibaryContainer = ({ library }: MyLibraryProps) => {
  const [image, setImage] = useState<string>("");
  useEffect(() => {
    if (library.movies[0]) {
      getMovieById(library.movies[0])
        .then((movie) => {
          setImage(movie.poster);
          console.log("poster");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [library.movies[0]]);
  console.log("library", library);

  return (
    <div className="library-container">
      <div className="library-content-container">
        {image ? (
          <div className="populated-library-container">
            <div className="library-text">{library.name}</div>
            <img className="library-image" src={image} />
          </div>
        ) : (
          <div className="library-text">Library {library.name} is empty</div>
        )}
      </div>
    </div>
  );
};

export default MyLibaryContainer;
