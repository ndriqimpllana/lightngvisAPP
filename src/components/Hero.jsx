import { useState, useEffect, useRef } from "react";
import { photos } from "../assets/images";
import "./Hero.css";

function formatTitle(photo) {
  if (!photo.titleItalic) return photo.title;
  return photo.title.replace(photo.titleItalic, `<em>${photo.titleItalic}</em>`);
}

function Hero() {
  const [current, setCurrent] = useState(0);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [loadedIndices, setLoadedIndices] = useState(() => new Set([0]));

  useEffect(() => {
    const conn =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    const updateConnectionMode = () => {
      const slowTypes = ["slow-2g", "2g", "3g"];
      const shouldReduceData =
        Boolean(conn?.saveData) || slowTypes.includes(conn?.effectiveType);
      setIsSlowConnection(shouldReduceData);
    };
    updateConnectionMode();
    conn?.addEventListener?.("change", updateConnectionMode);
    return () => conn?.removeEventListener?.("change", updateConnectionMode);
  }, []);

  useEffect(() => {
    if (isSlowConnection) return undefined;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isSlowConnection]);

  useEffect(() => {
    if (isSlowConnection) return;
    const next = (current + 1) % photos.length;
    [current, next].forEach((index) => {
      setLoadedIndices((prev) => {
        if (prev.has(index)) return prev;
        const updated = new Set(prev);
        updated.add(index);
        return updated;
      });
      const img = new Image();
      img.src = photos[index].src;
    });
  }, [current, isSlowConnection]);

  const activeIndex = isSlowConnection ? 0 : current;
  const photo = photos[activeIndex] || photos[0];

  return (
    <section id="hero" className="hero" aria-label={`Photograph: ${photo.title}`}>
      <div className="hero__slideshow">
        {photos.map((p, i) => (
          <div
            key={p.id}
            className={`hero__slide ${i === activeIndex ? "hero__slide--active" : ""}`}
            role="img"
            aria-label={i === activeIndex ? `${p.title}, ${p.location}` : ''}
            aria-hidden={i !== activeIndex}
            style={
              isSlowConnection
                ? i === 0
                  ? { backgroundImage: `url(${photos[0].src})` }
                  : undefined
                : loadedIndices.has(i)
                  ? { backgroundImage: `url(${p.src})` }
                  : undefined
            }
          />
        ))}
      </div>

      <div className="hero__wash" />

      <div className="hero__credit">
        N° {String(activeIndex + 1).padStart(2, "0")} / {photos.length} · {photo.location} · {photo.year}
      </div>

      <figcaption className="hero__caption">
        <h1
          className="hero__title"
          dangerouslySetInnerHTML={{ __html: formatTitle(photo) }}
        />
      </figcaption>

      <div className="hero__counter">
        {String(activeIndex + 1).padStart(2, "0")} — {String(photos.length).padStart(2, "0")}
      </div>

      <div className="hero__dots">
        {photos.slice(0, 5).map((_, i) => (
          <button
            key={i}
            className={`hero__dot ${i === activeIndex ? "hero__dot--on" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Photo ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;
