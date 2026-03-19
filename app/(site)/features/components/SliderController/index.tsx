"use client";

import { useState } from "react";

import { WhyNowSliders } from "../WhyNowSliders";
import { WhyNowSavingsBand } from "../WhyNowSavingsBand";

const SUB_M = 1299;
const SUB_Y = SUB_M * 12;

export function SliderController() {
  const [writer, setWriter] = useState(4500);
  const [designer, setDesigner] = useState(7000);
  const [seo, setSeo] = useState(6000);
  const [social, setSocial] = useState(5500);
  const [video, setVideo] = useState(6000);
  const [dev, setDev] = useState(8000);

  const totalM = writer + designer + seo + social + video + dev;
  const totalY = totalM * 12;
  const saveM = totalM - SUB_M;
  const saveY = totalY - SUB_Y;
  const pct = Math.round((saveM / totalM) * 100);

  return (
    <>
      <WhyNowSliders
        writer={writer}
        designer={designer}
        seo={seo}
        social={social}
        video={video}
        dev={dev}
        totalM={totalM}
        totalY={totalY}
        setWriter={setWriter}
        setDesigner={setDesigner}
        setSeo={setSeo}
        setSocial={setSocial}
        setVideo={setVideo}
        setDev={setDev}
      />
      <WhyNowSavingsBand saveM={saveM} saveY={saveY} pct={pct} />
    </>
  );
}

