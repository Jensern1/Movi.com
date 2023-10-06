import { useQuery } from "@tanstack/react-query";
import movieAPI from "../../services/movieAPI";
import { useEffect, useState } from "react";
import { MovieContent } from "../../interfaces";

import MovieContainerGrid from "../../components/movieContainerGrid/MovieContainerGrid";
import "./HomePage.css";

/**
 * Render the HomePage component.
 * @returns {React.FC}
 */
const HomePage: React.FC = () => {
  const [originals, setOriginals] = useState<MovieContent[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["movies"],
    queryFn: movieAPI,
  });

  useEffect(() => {
    if (data && data instanceof Array) {
      setOriginals(data);
      console.log("setts data");
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="HomePageContainer">
      <MovieContainerGrid />
    </div>
  );
};

export default HomePage;
