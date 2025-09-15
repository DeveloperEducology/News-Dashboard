import React, { useEffect } from "react";

export default function TwitterEmbed() {
  useEffect(() => {
    // Dynamically load Twitter’s widgets.js once
    if (!window.twttr) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // If script already loaded, re-run the parser
      window.twttr.widgets.load();
    }
  }, []);

  return (
    <div>
      <blockquote className="twitter-tweet" data-media-max-width="560">
        <p lang="en" dir="ltr">
          Vladimir Putin ~ A Rare Thread 🧵 <br />
          <br />
          1. Even Vladimir Putin knows the proper way to hold a dog{" "}
          <a href="https://t.co/FGHH7AxHPV">pic.twitter.com/FGHH7AxHPV</a>
        </p>
        &mdash; Crazy Moments (@Crazymoments01){" "}
        <a href="https://twitter.com/Crazymoments01/status/1963081843835597107">
          September 3, 2025
        </a>
      </blockquote>
    </div>
  );
}
