interface ArrowCircleLeftBlackProps {
  className?: string;
}

export const ArrowCircleLeftBlack = ({
  className,
}: ArrowCircleLeftBlackProps) => {
  return (
    <svg
      className={`vuesax-linear-arrow-circle-left ${className}`}
      fill="none"
      height="64"
      viewBox="0 0 64 64"
      width="64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        d="M31.9999 58.6667C46.7275 58.6667 58.6666 46.7276 58.6666 32C58.6666 17.2724 46.7275 5.33333 31.9999 5.33333C17.2723 5.33333 5.33325 17.2724 5.33325 32C5.33325 46.7276 17.2723 58.6667 31.9999 58.6667Z"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        strokeWidth="1.5"
      />
      <path
        className="path"
        d="M35.3601 41.4133L25.9734 32L35.3601 22.5867"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};
