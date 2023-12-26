import Spinner from "./spinner";

const Loading = () => (
  <div className="flex items-center gap-2">
    <Spinner />
    <span className="animate-pulse">Loading</span>
  </div>
);
export default Loading;
