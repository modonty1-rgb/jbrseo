"use client";

import { useState } from "react";
import { Play } from "lucide-react";

/**
 * A YouTube thumbnail that becomes a YouTube player on click.
 *
 * An `<iframe src="youtube.com/embed/...">` loads the whole player — YouTube's script,
 * its stylesheets and its cookies — the moment the page renders, whether or not anyone
 * watches. Two testimonials meant two players downloaded by every visitor to a section
 * most of them scroll past. This ships one image instead, and buys the player only when
 * someone asks for it.
 *
 * `autoplay=1` on the swapped-in iframe is deliberate: the click was the play gesture, so
 * requiring a second click on YouTube's own button would read as a broken button.
 *
 * The thumbnail is a plain `<img>`, not `next/image` — i.ytimg.com is not in the image
 * config, and routing a file YouTube already serves optimised through our optimiser buys
 * nothing but a cache entry. It also needs an `onError`, which `next/image` does not
 * expose usefully; see the poster note below.
 */
/**
 * `maxresdefault` is 1280×720 — the only variant that is actually 16:9. `hqdefault` is
 * 480×360, so `object-cover` in a 16:9 frame shaved the top and bottom off every face,
 * and 480px was soft on a card twice that wide. YouTube also renders a vertical Short
 * into this variant itself, blurred backdrop and all, so a Short needs no special case.
 *
 * It is the one variant YouTube does not guarantee, so a miss falls back to `hqdefault` —
 * cropped is survivable, a broken image is not.
 */
const MAXRES = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
const FALLBACK = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export function VideoFacade({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const [poster, setPoster] = useState(() => MAXRES(videoId));

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0 block"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`شغّل شهادة ${title}`}
      className="group absolute inset-0 w-full h-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success"
    >
      <img
        src={poster}
        onError={() => setPoster(FALLBACK(videoId))}
        alt=""
        width={1280}
        height={720}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <span className="absolute inset-0 bg-foreground/25 transition-colors group-hover:bg-foreground/10" aria-hidden />
      {/* Centred by flex, not by translate — `start-1/2` plus a mirrored translate is three
          classes fighting each other for the same result. */}
      <span className="absolute inset-0 flex items-center justify-center" aria-hidden>
        <span className="flex items-center justify-center w-16 h-16 rounded-full bg-background/90 shadow-lg transition-transform group-hover:scale-110">
          {/* Physical `ml-1`, and no RTL mirror. A play triangle is a transport control, not
              text — it points along the direction the recording runs, which is the same in
              both scripts. The nudge is right because a right-pointing triangle carries its
              visual mass left of its geometric centre. */}
          <Play className="w-7 h-7 text-foreground fill-current ml-1" strokeWidth={1.5} />
        </span>
      </span>
    </button>
  );
}
