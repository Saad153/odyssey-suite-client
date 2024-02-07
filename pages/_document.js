import Document, { Html, Head, Main, NextScript } from 'next/document';

class MainDocument extends Document {
  render() {
    return (
    <Html>
      <Head >
        <meta name="description" content="Lead Management System" />
        <link rel="icon" href="/favicon.ico" />
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" as="font" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com"  />
        <link href="https://fonts.googleapis.com/css2?family=Alata&display=swap" rel="stylesheet"></link> */}
      </Head>
      <body>
      <Main />
      <NextScript />
      </body>
    </Html>
    )
  }
}

export default MainDocument