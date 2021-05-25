/*  
COMP90024 Cloud Computing Project 2
  Team 40:
  Mark Drvodelic, 1068574
  Colton Carner, 693280
  Bing Xu, 833684
  Zihao Zhang, 1151006
  Brandon Lulham, 1162377
*/

import Header from "./Header";
import Footer from "./Footer";
import Head from "next/head";

const Layout = ({ children, title, description, ogImage, url }) => {
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