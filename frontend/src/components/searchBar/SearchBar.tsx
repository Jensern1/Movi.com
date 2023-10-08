import React, { FunctionComponent, useCallback, useState } from "react";
import { FormControl, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import "./SearchBar.css";

import debounce from "lodash/debounce";

interface Props {
  onSearch: (value: string) => void;
}

const TypeSearch: FunctionComponent<Props> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnSearch = useCallback(debounce(onSearch, 300), [onSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    debouncedOnSearch(value); // This will trigger the debouncedOnSearch callback after 500ms
    setSearchValue(value);
  };

  const handleClick = (): void => {
    setSearchValue("");
    onSearch("");
  };

  return (
    <div className="SearchbarContainer">
      <FormControl fullWidth sx={{ m: 6 }}>
        <TextField
          value={searchValue}
          variant="outlined"
          onChange={handleChange}
          placeholder="Search..."
          sx={{
            "& .MuiOutlinedInput-root": {
              borderWidth: "4px",
              borderRadius: "15px",
              "&.Mui-focused fieldset": {
                borderWidth: "4px",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end" onClick={handleClick}>
                <ClearIcon
                  style={{ cursor: "pointer", opacity: searchValue ? 1 : 0 }}
                />
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
    </div>
  );
};

export default TypeSearch;
