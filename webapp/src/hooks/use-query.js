import React from "react";
import {
  useLocation
} from "react-router-dom";

export  function useQuery() {
    let { search } = useLocation();
    const redirectUrl = new URLSearchParams(search).get('continueUrl');
    if (redirectUrl) {
        search = new URL(redirectUrl).searchParams;
    }
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }
