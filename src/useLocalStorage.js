import { useState, useEffect } from "react";

export function useLocalStorage() {
  const [watched, setWatched] = useState(function () {
    let list = localStorage.getItem("watchList");
    if (list) {
      return JSON.parse(list);
    } else {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("watchList", JSON.stringify(watched));
  }, [watched]);

  return [watched, setWatched];
}
