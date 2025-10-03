export const Shadow = () => {
  return (
    <svg
      width="23"
      height="24"
      viewBox="0 0 23 24"
      fill="none"
      xmlns="//www.w3.org/2000/svg"
    >
      <path
        d="M22.0348 17.6278L11.196 11.196V24L22.0348 17.6278Z"
        fill="url(#shadow_grad)"
      />
      <path
        d="M10.296 22.2882L0.9 16.2229V1.67628L10.296 7.90411V22.2882Z"
        stroke="#24272CB3"
        strokeWidth="1.8"
      />
      <defs>
        <linearGradient
          id="shadow_grad"
          x1="11.1365"
          y1="24"
          x2="17.1514"
          y2="16.3772"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#24272CB3" />
          <stop offset="1" stopColor="#24272CB3" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Shadow;
