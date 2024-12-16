import React from "react";
import Navbar from "./navbar";

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main style={styles.main}>{children}</main>
    </div>
  );
};

const styles = {
  main: {
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
};

export default Layout;
