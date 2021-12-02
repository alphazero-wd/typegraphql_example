import { FC } from "react";

const Layout: FC = ({ children }) => {
  return (
    <section className="p-5">
      <div className="container" style={{ maxWidth: "600px" }}>
        {children}
      </div>
    </section>
  );
};

export default Layout;
