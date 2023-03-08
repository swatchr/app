export const beforeBox = ({
  // gradient = "linear-gradient(180deg, rgba(233, 255, 219, 0.6) 60%, rgba(233, 255, 219,0.0) 100%)",
  ...rest
}) => ({
  content: '""',
  display: "block",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  // backgroundImage: gradient,
  bgGradient: "linear(to-br, brand.200,  rgba(233, 255, 219,0.0) )",
  w: "full",
  // h: "100vh",
  zIndex: -1,
  ...rest,
});
