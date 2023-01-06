import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function ActivatedLiLink(props) {
  const location = useLocation();
  let pathToMatch = getPathToMatch(location.pathname);
  return (
    <li className={`nav-item  ${pathToMatch === props.path ? "active" : ""}`}>
      <Link className="nav-link" to={props.path} id={props.id}>
        {props.title}
      </Link>
    </li>
  );

  function getPathToMatch(locationPath) {
    let pathToMatch = locationPath;
    const accordingToRoot = props.accordingToRoot
      ? props.accordingToRoot
      : false;
    if (accordingToRoot) {
      const indexOfSecondSlash = pathToMatch.slice(1).indexOf("/");
      if (indexOfSecondSlash > -1) {
        pathToMatch = pathToMatch.substr(0, indexOfSecondSlash + 1);
      }
    }
    return pathToMatch;
  }
}
