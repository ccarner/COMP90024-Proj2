import Header from "./Header";
import Footer from "./Footer";

import Head from "next/head";

const Layout = ({ children, title, description, ogImage, url }) => {
  // website Url
  const pageUrl =
    "https://nextjs-and-material-ui-template-with-header-and-footer.vercel.app/";
  // when you share this page on facebook you'll see this image
  const ogImg = "https://i.imgur.com/1H2TK2B.png";
  return (
    <>
      <Head>
        <title>
          {title
            ? title
            : "COMP90024"}
        </title>
      </Head>
      <Header />
      <main>{children}</main>
      <Footer />
      {/* <style jsx global>
        {`
          html,
          body {
            background: #f9f9f9;
            overflow-x: hidden;
            padding: 0 !important;
          }
          #__next {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          main {
            flex: 1;
          }
        `}
      </style> */}
    </>
  );
};

export default Layout;