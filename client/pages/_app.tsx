import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import Layout from "../components/Layout";
import { client } from "./client";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
