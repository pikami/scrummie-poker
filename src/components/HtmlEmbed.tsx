interface HtmlEmbedProps {
  body: string;
  className: string;
}

const HtmlEmbed: React.FC<HtmlEmbedProps> = ({ body, className }) => {
  if (!body) {
    return null;
  }

  const styles = `
        body {
            font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
            line-height: 1.5;
            font-weight: 400;

            color-scheme: light dark;
            color: rgba(255, 255, 255, 0.87);
            background-color: #242424;

            font-synthesis: none;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;

            overflow-y: hidden;
        }

        @media (prefers-color-scheme: light) {
            body {
                color: #213547;
                background-color: #ffffff;
            }
        }

        html:not(.x),body:not(.x){height:auto!important}
        p:first-child{margin-top:0;}
        p:last-child{margin-bottom:0;}
        a[href]{color: #3781B8;text-decoration:none;}
        a[href]:hover{text-decoration:underline;}
        blockquote[type=cite] {margin:0 0 0 .8ex;border-left: 1px #ccc solid;padding-left: 1ex;}
        img { max-width: 100%; }
        ul, ol { padding: 0; margin: 0 0 10px 25px; }
        ul { list-style-type: disc; }`;

  const cnt = `
        <html>
            <head>
                <meta http-equiv="Content-Security-Policy" content="script-src 'none'" />
                <base target="_blank" />
                <style>
                ${styles}
                </style>
            </head>
            <body>${body}</body>
        </html>`;

  const props = {
    csp: "script-src 'none'",
  };

  return (
    <iframe
      className={className}
      srcDoc={cnt}
      sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
      {...props}
    />
  );
};

export default HtmlEmbed;
