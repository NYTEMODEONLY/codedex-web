"use client";

import type { RefObject } from "react";
import { Pokeball } from "@/components/Pokeball";

interface CameraViewProps {
  cameraOn: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  /** Increment to trigger a one-shot green flash on successful capture. */
  flashKey: number;
}

const RETICLE_STROKE = 3; // px
const RETICLE_INNER_RADIUS = 8; // px (inside corner curve)
const RETICLE_SIZE = 28; // px length of each bracket arm

/**
 * Viewfinder. Renders a <video> element when on; an empty-state Pokeball
 * watermark + headline + hint when off. Adds an animated cyan reticle
 * (4 corner brackets + center crosshair + scan-line sweep) over the live feed.
 *
 * The flash overlay re-mounts via `key={flashKey}` so React replays the
 * `flash-fire` keyframe animation each time the parent increments the key.
 */
export function CameraView({ cameraOn, videoRef, flashKey }: CameraViewProps) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-xl border border-border"
      style={{ backgroundColor: "#050507" }}
    >
      {/* Video element — ALWAYS mounted and visible (display: block). qr-scanner's
          play() is sensitive to display: none, so we keep the element fully in
          flow and just cover it with the off-state pane when the camera is off. */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        autoPlay
      />

      {cameraOn && (
        <>
          {/* Reticle overlay — 4 corner brackets, center crosshair,
              scan-line sweep. Pulses subtly via reticle-pulse keyframe. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 [animation:reticle-pulse_2.4s_ease-in-out_infinite]"
          >
            <Reticle />
            {/* center crosshair */}
            <div
              className="absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 -translate-y-1/2"
              style={{ background: "var(--color-scan)", opacity: 0.6 }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-5 w-px -translate-x-1/2 -translate-y-1/2"
              style={{ background: "var(--color-scan)", opacity: 0.6 }}
            />
            {/* scan-line sweep — moves vertically 8% → 92% → 8% */}
            <div
              className="absolute left-[10%] right-[10%] h-[2px] [animation:scan-sweep_2.6s_ease-in-out_infinite]"
              style={{
                background: "var(--color-scan)",
                boxShadow: "0 0 18px var(--color-scan)",
                top: "8%",
              }}
            />
          </div>

          {/* Flash overlay — remounts on flashKey change to replay animation. */}
          <div
            key={flashKey}
            aria-hidden
            className="pointer-events-none absolute inset-0 [animation:flash-fire_320ms_ease-out_forwards]"
            style={{
              background: "var(--color-success)",
              opacity: 0,
            }}
          />
        </>
      )}

      {!cameraOn && (
        // Off-state pane — covers the (empty) video element with a dark
        // fill + watermark + hint. Uses solid background so no flicker if
        // the video element ever shows a paused frame.
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-6 text-center"
          style={{ backgroundColor: "#050507" }}
        >
          <Pokeball size={88} watermark />
          <h4 className="font-display text-[17px] font-semibold text-text">
            Camera Off
          </h4>
          <p
            className="font-body text-text-muted"
            style={{ fontSize: 13, maxWidth: 320 }}
          >
            Press Start Camera to begin scanning Pokémon TCG codes.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * 4 corner brackets, drawn with absolutely-positioned divs that have
 * an L-shape cut from a square via two-edge borders + rounded inner corner.
 */
function Reticle() {
  const stroke = `${RETICLE_STROKE}px solid var(--color-scan)`;
  const inset = "8%"; // distance of brackets from each viewport edge

  // Each corner uses two adjacent borders (top+left, top+right, bottom+left,
  // bottom+right) and a rounded-inner-corner via border-radius on the inside.
  return (
    <>
      {/* top-left */}
      <div
        className="absolute"
        style={{
          top: inset,
          left: inset,
          width: RETICLE_SIZE,
          height: RETICLE_SIZE,
          borderTop: stroke,
          borderLeft: stroke,
          borderTopLeftRadius: RETICLE_INNER_RADIUS,
        }}
      />
      {/* top-right */}
      <div
        className="absolute"
        style={{
          top: inset,
          right: inset,
          width: RETICLE_SIZE,
          height: RETICLE_SIZE,
          borderTop: stroke,
          borderRight: stroke,
          borderTopRightRadius: RETICLE_INNER_RADIUS,
        }}
      />
      {/* bottom-left */}
      <div
        className="absolute"
        style={{
          bottom: inset,
          left: inset,
          width: RETICLE_SIZE,
          height: RETICLE_SIZE,
          borderBottom: stroke,
          borderLeft: stroke,
          borderBottomLeftRadius: RETICLE_INNER_RADIUS,
        }}
      />
      {/* bottom-right */}
      <div
        className="absolute"
        style={{
          bottom: inset,
          right: inset,
          width: RETICLE_SIZE,
          height: RETICLE_SIZE,
          borderBottom: stroke,
          borderRight: stroke,
          borderBottomRightRadius: RETICLE_INNER_RADIUS,
        }}
      />
    </>
  );
}
