"use client";

import type { NextPage } from "next";
import { FairStakeFlow } from "~~/components/fairstake/FairStakeFlow";

const Home: NextPage = () => (
  <div className="flex flex-col grow py-8 md:py-12 px-4">
    <FairStakeFlow />
  </div>
);

export default Home;
