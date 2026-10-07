"use client";







import {



  useEffect,



  useRef,



  useState,



  type CSSProperties,



} from "react";



import { createThirdwebClient } from "thirdweb";



import {



  ThirdwebProvider,



  useActiveAccount,



  useActiveWallet,



  useConnect,



  useDisconnect,



} from "thirdweb/react";



import { inAppWallet } from "thirdweb/wallets";







const thirdwebClientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;







const thirdwebClient = thirdwebClientId



  ? createThirdwebClient({



      clientId: thirdwebClientId,



    })



  : null;







const xWallet = inAppWallet({



  auth: {



    mode: "popup",



    options: ["x"],



  },



});







type ScoreMetric = {



  name: string;



  value: number;



};







const scoreMetrics: ScoreMetric[] = [



  {



    name: "Activity",



    value: 35,



  },



  {



    name: "Consistency",



    value: 25,



  },



  {



    name: "Network",



    value: 25,



  },



  {



    name: "Influence",



    value: 15,



  },



];







function useInView(threshold = 0.3) {



  const ref = useRef<HTMLDivElement | null>(null);



  const [visible, setVisible] = useState(false);







  useEffect(() => {



    const element = ref.current;







    if (!element) return;







    const observer = new IntersectionObserver(



      ([entry]) => {



        if (entry.isIntersecting) {



          setVisible(true);



          observer.disconnect();



        }



      },



      {



        threshold,



      }



    );







    observer.observe(element);







    return () => observer.disconnect();



  }, [threshold]);







  return {



    ref,



    visible,



  };



}







function AnimatedNumber({



  target,



  active,



  duration = 1500,



  prefix = "",



}: {



  target: number;



  active: boolean;



  duration?: number;



  prefix?: string;



}) {



  const [value, setValue] = useState(0);







  useEffect(() => {



    if (!active) return;







    let startTime: number | null = null;



    let animationFrame = 0;







    const animate = (timestamp: number) => {



      if (startTime === null) {



        startTime = timestamp;



      }







      const progress = Math.min(



        (timestamp - startTime) / duration,



        1



      );







      const eased = 1 - Math.pow(1 - progress, 3);







      setValue(Math.floor(eased * target));







      if (progress < 1) {



        animationFrame = requestAnimationFrame(animate);



      } else {



        setValue(target);



      }



    };







    animationFrame = requestAnimationFrame(animate);







    return () => {



      cancelAnimationFrame(animationFrame);



    };



  }, [active, target, duration]);







  return (



    <>



      {prefix}



      {value}



    </>



  );



}







function getDeterministicScore(identifier: string) {
  let hash = 0;

  for (let i = 0; i < identifier.length; i += 1) {
    hash = (hash << 5) - hash + identifier.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash) % 1001;
}


function HomeContent() {



  const { connect, isConnecting } = useConnect();
  const { disconnect } = useDisconnect();



  const account = useActiveAccount();
  const wallet = useActiveWallet();







  const heroScore = useInView(0.35);



  const scoreSection = useInView(0.3);



  const scoreValue = account?.address
    ? getDeterministicScore(account.address)
    : 0;

  const scorePercentage = scoreValue / 1000;

  const minimumReward = 20000;
  const maximumReward = 100000;

  // Reward scales linearly with Score: 0 Score = 20,000 FORGE,
  // 1,000 Score = 100,000 FORGE.
  const currentReward = Math.round(
    minimumReward +
      (maximumReward - minimumReward) * scorePercentage
  );

  const rewardProgress = scorePercentage * 100;


  const logout = () => {
    if (wallet) {
      disconnect(wallet);
    }
  };


  const connectX = () => {



    connect(async () => {



      if (!thirdwebClient) {



        throw new Error(



          "Thirdweb Client ID is missing."



        );



      }







      await xWallet.connect({



        client: thirdwebClient,



        strategy: "x",



      });







      return xWallet;



    });



  };







  return (



    <main className="min-h-screen bg-[#050505] text-white">



      {/* NAVBAR */}







      <nav className="relative z-20 border-b border-white/[0.08]">



        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">



          <div className="flex items-center gap-3">



            <div className="logo-mark">



              <span />



              <span />



              <span />



              <span />



            </div>







            <span className="text-lg font-semibold tracking-tight">



              HoodForge



            </span>



          </div>







          <div className="hidden items-center gap-8 text-sm text-white/60 md:flex">



            <a



              href="#how-it-works"



              className="whitespace-nowrap transition hover:text-white"



            >



              How it works



            </a>







            <a



              href="#score"



              className="whitespace-nowrap transition hover:text-white"



            >



              Score



            </a>







            <a



              href="#rewards"



              className="whitespace-nowrap transition hover:text-white"



            >



              Rewards



            </a>



          </div>
          {account ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-medium transition hover:border-red-400/40 hover:bg-red-400/[0.06]"
            >
              Log out
            </button>
          ) : (
            <button
              type="button"
              disabled={isConnecting}
              onClick={connectX}
              className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-medium transition hover:border-[#ccff00]/40 hover:bg-[#ccff00]/10 disabled:cursor-wait disabled:opacity-60"
            >
              {isConnecting ? "Connecting..." : "Connect X"}
            </button>
          )}



        </div>



      </nav>







      {/* HERO */}







      <section className="relative overflow-hidden">



        <div className="hero-background" />







        <div className="hero-layout relative z-10 mx-auto min-h-[720px] max-w-7xl items-center gap-16 px-6 py-24 lg:px-10">



          {/* HERO LEFT */}







          <div className="hero-copy relative z-10 max-w-2xl">



            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#ccff00]/20 bg-[#ccff00]/[0.06] px-4 py-2 text-xs font-medium text-[#ccff00]">



              <span className="h-1.5 w-1.5 rounded-full bg-[#ccff00] shadow-[0_0_10px_#ccff00]" />







              The value of your X, measured.



            </div>







            <h1 className="text-6xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-7xl lg:text-[88px]">



              YOUR X



              <br />







              <span className="text-white/40">



                HAS A



              </span>







              <br />







              <span className="text-[#ccff00]">



                VALUE.



              </span>



            </h1>







            <p className="mt-8 max-w-lg text-lg leading-8 text-white/50">



              Connect your X account, discover your



              HoodForge score and see what your activity



              can unlock.



            </p>







            <div className="mt-10 flex flex-wrap items-center gap-4">



              <button
                type="button"
                disabled={isConnecting}
                onClick={account ? logout : connectX}
                className="group flex items-center gap-3 rounded-full bg-[#ccff00] px-7 py-4 text-sm font-semibold text-black transition hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(204,255,0,0.2)] disabled:cursor-wait disabled:opacity-60"
              >
                {isConnecting ? "Connecting..." : account ? "Log out" : "Connect X"}

                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>







              <a



                href="#how-it-works"



                className="rounded-full border border-white/10 px-7 py-4 text-sm font-medium text-white/70 transition hover:border-white/20 hover:text-white"



              >



                Explore HoodForge



              </a>



            </div>



          </div>







          {/* SCORE CARD */}







          <div



            ref={heroScore.ref}



            className="hero-score-wrap relative flex justify-center lg:justify-end"



          >



            <div



              className={`score-card ${



                heroScore.visible



                  ? "score-card-active"



                  : ""



              }`}



            >



              {/* CARD HEADER */}







              <div className="flex items-center justify-between">



                <div



                  className={`score-card-header ${



                    heroScore.visible



                      ? "score-card-element-active"



                      : ""



                  }`}



                >



                  <p className="text-xs uppercase tracking-[0.2em] text-white/30">



                    HoodForge



                  </p>







                  <p className="mt-1 text-sm text-white/50">



                    Your Score



                  </p>



                </div>







                <div



                  className={`logo-mark small ${



                    heroScore.visible



                      ? "score-logo-active"



                      : ""



                  }`}



                >



                  <span />



                  <span />



                  <span />



                  <span />



                </div>



              </div>







              {/* SCORE */}







              <div



                className={`mt-16 score-main ${



                  heroScore.visible



                    ? "score-card-element-active score-main-active"



                    : ""



                }`}



              >



                <p className="text-xs uppercase tracking-[0.2em] text-white/30">



                  Your score



                </p>







                <div className="mt-2 flex items-end gap-3">



                  <span className="text-7xl font-semibold tracking-[-0.06em]">



                    <AnimatedNumber



                      target={scoreValue}



                      active={heroScore.visible}



                      duration={1600}



                    />



                  </span>







                  <span



                    className={`mb-3 text-sm text-[#ccff00] score-max ${



                      heroScore.visible



                        ? "score-card-element-active"



                        : ""



                    }`}



                  >



                    / 1000



                  </span>



                </div>



              </div>







              {/* REWARD */}







              <div



                className={`reward-visual ${



                  heroScore.visible



                    ? "reward-visual-active"



                    : ""



                }`}



              >



                <div className="flex items-end justify-between">



                  <div>



                    <p className="reward-label">



                      Potential Reward



                    </p>







                    <div className="mt-1 flex items-baseline gap-2">



                      <span className="reward-current">
                        <AnimatedNumber
                          target={currentReward}
                          active={heroScore.visible}
                          duration={1800}
                          prefix=""
                        />
                      </span>
                      <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[#ccff00]">
                        FORGE
                      </span>







                      <span className="reward-status">



                        Pending



                      </span>



                    </div>



                  </div>







                  <div className="reward-range">



                    20,000 — 100,000 FORGE



                  </div>



                </div>







                <div className="reward-track-wrapper">



                  <div className="reward-track">



                    <div



                      className="reward-track-fill"



                      style={



                        {



                          "--reward-progress": `${rewardProgress}%`,



                        } as CSSProperties



                      }



                    />







                    <div



                      className="reward-marker"



                      style={



                        {



                          "--reward-progress": `${rewardProgress}%`,



                        } as CSSProperties



                      }



                    >



                      F



                    </div>



                  </div>







                  <div className="reward-track-labels">



                    <span>20K</span>



                    <span>100K</span>



                  </div>



                </div>



              </div>







              <div className="mt-6">
                <button
                  type="button"
                  disabled={!account}
                  className="w-full rounded-xl bg-[#ccff00] px-5 py-3 text-sm font-semibold text-black transition hover:shadow-[0_0_30px_rgba(204,255,0,0.16)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Unlock Reward
                </button>
                <p className="mt-3 text-center text-[10px] font-black uppercase leading-5 tracking-[0.08em] text-[#ccff00] drop-shadow-[0_0_10px_rgba(204,255,0,0.18)]">
                  (ONLY USERS WHO COMPLETE THE REQUIRED INTERACTIONS WILL RECEIVE REWARDS.)
                </p>
              </div>

              {/* CARD STATS */}

              <div className="mt-7 grid grid-cols-2 gap-3">
                <div
                  className={`mini-stat score-stat ${
                    heroScore.visible
                      ? "score-card-element-active score-stat-one"
                      : ""
                  }`}
                >
                  <span>Reward</span>
                  <strong>Pending</strong>
                </div>

                <div
                  className={`mini-stat score-stat ${
                    heroScore.visible
                      ? "score-card-element-active score-stat-two"
                      : ""
                  }`}
                >
                  <span>Network</span>
                  <strong>128</strong>
                </div>
              </div>

              {account && (
                <div className="mt-6 border-t border-white/[0.06] pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                        Boost Your Reward Multiplier
                      </p>
                      <p className="mt-1 text-sm text-white/65">
                        Complete the required HoodForge interactions on X to boost your reward multiplier.
                      </p>
                    </div>

                    <span className="rounded-full border border-[#ccff00]/15 bg-[#ccff00]/[0.06] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#ccff00]">
                      + Multiplier
                    </span>
                  </div>

                  <a
                    href="https://x.com/hoodforgepad/status/2107882168974180427?s=20"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 block rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 transition hover:border-[#ccff00]/30 hover:bg-[#ccff00]/[0.04]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-sm font-semibold">
                        X
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white">
                          HoodForge
                        </p>
                        <p className="mt-1 text-xs text-white/30">
                          Like, repost, and comment to boost your reward multiplier.
                        </p>
                      </div>

                      <span className="ml-auto text-lg text-white/30">↗</span>
                    </div>
                  </a>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/[0.07] px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-white/45">
                      Like
                    </span>
                    <span className="rounded-full border border-white/[0.07] px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-white/45">
                      Repost
                    </span>
                    <span className="rounded-full border border-white/[0.07] px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-white/45">
                      Comment
                    </span>
                  </div>

                  <p className="mt-4 text-xs leading-5 text-white/30">
                    Like, repost, and comment on the HoodForge post to boost your reward multiplier.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>



      {/* HOW IT WORKS */}







      <section



        id="how-it-works"



        className="border-t border-white/[0.06] px-6 py-28 lg:px-10"



      >



        <div className="mx-auto max-w-7xl">



          <div className="max-w-xl">



            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#ccff00]">



              How it works



            </p>







            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">



              From your X



              <br />



              to your value.



            </h2>







            <p className="mt-6 max-w-lg text-sm leading-7 text-white/40">



              Connect once. Discover your score. Build



              your network. Unlock what your activity can



              become.



            </p>



          </div>







          <div className="workflow mt-16">



            <div className="workflow-card">



              <span className="workflow-number">



                01



              </span>







              <div className="workflow-content">



                <div className="workflow-icon">



                  X



                </div>







                <h3>Connect X</h3>







                <p>



                  Link your X account to HoodForge.



                </p>



              </div>



            </div>







            <div className="workflow-connection">



              <div className="flow-line">



                <div className="flow-energy" />



              </div>







              <div className="flow-arrow">



                →



              </div>



            </div>







            <div className="workflow-card">



              <span className="workflow-number">



                02



              </span>







              <div className="workflow-content">



                <div className="workflow-icon score-icon">



                  +



                </div>







                <h3>Get your Score</h3>







                <p>



                  Your activity becomes your HoodForge



                  score.



                </p>



              </div>



            </div>







            <div className="workflow-connection">



              <div className="flow-line">



                <div className="flow-energy" />



              </div>







              <div className="flow-arrow">



                →



              </div>



            </div>







            <div className="workflow-card">



              <span className="workflow-number">



                03



              </span>







              <div className="workflow-content">



                <div className="workflow-icon network-icon">



                  <span />



                  <span />



                  <span />



                </div>







                <h3>Build your Network</h3>







                <p>



                  Invite people and grow your network.



                </p>



              </div>



            </div>







            <div className="workflow-connection">



              <div className="flow-line">



                <div className="flow-energy" />



              </div>







              <div className="flow-arrow">



                →



              </div>



            </div>







            <div className="workflow-card">



              <span className="workflow-number">



                04



              </span>







              <div className="workflow-content">



                <div className="workflow-icon reward-icon">



                  $



                </div>







                <h3>Unlock Rewards</h3>







                <p>



                  Your score and network can unlock



                  higher rewards.



                </p>



              </div>



            </div>



          </div>



        </div>



      </section>







      {/* SCORE */}







      <section



        ref={scoreSection.ref}



        id="score"



        className="border-t border-white/[0.06] px-6 py-28 lg:px-10"



      >



        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">



          <div>



            <p className="text-xs uppercase tracking-[0.25em] text-[#ccff00]">



              Your Score



            </p>







            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">



              One account.



              <br />



              One score.



            </h2>







            <p className="mt-6 max-w-lg leading-7 text-white/40">



              HoodForge turns meaningful activity around



              your X account into a simple score you can



              understand and track.



            </p>



          </div>







          <div className="grid gap-3 sm:grid-cols-2">



            {scoreMetrics.map((metric, index) => (



              <div



                key={metric.name}



                className={`metric-card ${



                  scoreSection.visible



                    ? "metric-card-active"



                    : ""



                }`}



                style={{



                  transitionDelay: scoreSection.visible



                    ? `${index * 100}ms`



                    : "0ms",



                }}



              >



                <div className="flex items-center justify-between">



                  <span>{metric.name}</span>







                  <strong>



                    {metric.value}%



                  </strong>



                </div>







                <div className="score-bar">



                  <div



                    className={`score-bar-fill ${



                      scoreSection.visible



                        ? "score-bar-active"



                        : ""



                    }`}



                    style={



                      {



                        "--score-width": `${metric.value}%`,



                      } as CSSProperties



                    }



                  />



                </div>



              </div>



            ))}



          </div>



        </div>



      </section>







      {/* REWARDS */}







      <section



        id="rewards"



        className="border-t border-white/[0.06] px-6 py-28 lg:px-10"



      >



        <div className="mx-auto max-w-7xl">



          <div className="reward-section">



            <div className="max-w-2xl">



              <p className="text-xs uppercase tracking-[0.25em] text-[#ccff00]">



                Rewards



              </p>







              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">



                Your score should



                <br />



                mean something.



              </h2>







              <p className="mt-6 leading-7 text-white/40">



                Your HoodForge score can determine your



                position within the reward range. Higher



                scores can unlock higher potential rewards.



              </p>







              <div className="mt-8 flex flex-wrap items-center gap-4">



                <div className="reward-pill">



                  <span>Potential range</span>







                  <strong>



                    20,000 — 100,000 FORGE



                  </strong>



                </div>







                <div className="reward-pill">



                  <span>Current example</span>







                  <strong>



                    842 → 87,360 FORGE



                  </strong>



                </div>



              </div>







              <p className="mt-6 text-xs leading-6 text-white/25">



                Rewards shown are potential rewards and



                may be subject to eligibility requirements.



              </p>



            </div>            

              {account && (

                <div className="mt-8 flex w-full max-w-lg items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-md">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#ccff00]/20 bg-[#ccff00]/10 text-sm font-bold text-[#ccff00]">

                    X

                  </div>

                  <div className="min-w-0">

                    <p className="text-xs uppercase tracking-[0.18em] text-white/30">

                      Connected X profile

                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-white">

                      X Account Connected

                    </p>

                    <p className="mt-1 truncate text-xs text-white/30">

                      {account.address}

                    </p>

                  </div>

                  <div className="ml-auto hidden rounded-full border border-[#ccff00]/15 bg-[#ccff00]/[0.06] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#ccff00] sm:block">

                    Connected

                  </div>

                </div>

              )}





          </div>



        </div>



      </section>







      {/* FOOTER */}







      <footer className="border-t border-white/[0.06] px-6 py-10 lg:px-10">



        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-white/30 sm:flex-row">



          <span>



            © 2026 HoodForge



          </span>







          <span>



            Your X. Your value.



          </span>



        </div>



      </footer>



    </main>



  );



}







export default function Home() {



  return (



    <ThirdwebProvider>



      <HomeContent />



    </ThirdwebProvider>



  );



}