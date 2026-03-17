import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // nếu muốn nhảy ngay lập tức thì dùng "auto"
    });
  }, [pathname]);

  return null;
}

export default ScrollToTop;
