import Container from "../components/container";
import Navbar from "../components/navbar";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Container>
        <Component {...pageProps} />
      </Container>
    </>
  );
}

export default MyApp;
