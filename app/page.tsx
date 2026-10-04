"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

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
        animationFrame =
          requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    };

    animationFrame =
      requestAnimationFrame(animate);

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

export default function Home() {
  const heroScore = useInView(0.35);
  const scoreSection = useInView(0.3);

  /*
   * Score:
   * 842 / 1000 = 84.2%
   *
   * Reward range:
   * $50 minimum
   * $200 maximum
   *
   * At 84.2%:
   * $50 + (150 × 0.842) = $176.3
   *
   * Displayed as $176.
   */
  const scoreValue = 842;
  const scorePercentage = scoreValue / 1000;

  const minimumReward = 50;
  const maximumReward = 200;

  const currentReward = Math.round(
    minimumReward +
      (maximumReward - minimumReward) *
        scorePercentage
  );

  const rewardProgress = scorePercentage * 100;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* =====================================================
          NAVBAR
      ===================================================== */}

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
              className="transition hover:text-white"
            >
              How it works
            </a>

            <a
              href="#score"
              className="transition hover:text-white"
            >
              Score
            </a>

            <a
              href="#rewards"
              className="transition hover:text-white"
            >
              Rewards
            </a>
          </div>

          <button className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-medium transition hover:border-[#ccff00]/40 hover:bg-[#ccff00]/10">
            Connect X
          </button>
        </div>
      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden">
        <div className="hero-background" />

        <div className="relative z-10 mx-auto grid min-h-[720px] max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:px-10">
          {/* HERO LEFT */}

          <div className="relative z-10 max-w-2xl">
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
              Connect your X account, discover your HoodForge score and see
              what your activity can unlock.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button className="group flex items-center gap-3 rounded-full bg-[#ccff00] px-7 py-4 text-sm font-semibold text-black transition hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(204,255,0,0.2)]">
                Connect X

                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>

              <button className="rounded-full border border-white/10 px-7 py-4 text-sm font-medium text-white/70 transition hover:border-white/20 hover:text-white">
                Explore HoodForge
              </button>
            </div>
          </div>

          {/* =================================================
              HERO SCORE / REWARD CARD
          ================================================= */}

          <div
            ref={heroScore.ref}
            className="relative flex justify-center lg:justify-end"
          >
            <div
              className={`score-card ${
                heroScore.visible
                  ? "score-card-active"
                  : ""
              }`}
            >
              {/* Card Header */}

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
                    Personal Score
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

              {/* Score */}

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

              {/* =================================================
                  REWARD VISUAL
              ================================================= */}

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
                          prefix="$"
                        />
                      </span>

                      <span className="reward-status">
                        Pending
                      </span>
                    </div>
                  </div>

                  <div className="reward-range">
                    $50 — $200
                  </div>
                </div>

                {/* Reward Track */}

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

                    {/* Dollar Marker */}

                    <div
                      className="reward-marker"
                      style={
                        {
                          "--reward-progress": `${rewardProgress}%`,
                        } as CSSProperties
                      }
                    >
                      $
                    </div>
                  </div>

                  <div className="reward-track-labels">
                    <span>
                      $50
                    </span>

                    <span>
                      $200
                    </span>
                  </div>
                </div>
              </div>

              {/* =================================================
                  CARD STATS
              ================================================= */}

              <div className="mt-7 grid grid-cols-2 gap-3">
                <div
                  className={`mini-stat score-stat ${
                    heroScore.visible
                      ? "score-card-element-active score-stat-one"
                      : ""
                  }`}
                >
                  <span>
                    Reward
                  </span>

                  <strong>
                    Pending
                  </strong>
                </div>

                <div
                  className={`mini-stat score-stat ${
                    heroScore.visible
                      ? "score-card-element-active score-stat-two"
                      : ""
                  }`}
                >
                  <span>
                    Network
                  </span>

                  <strong>
                    128
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

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
              Connect once. Discover your score. Build your network.
              Unlock what your activity can become.
            </p>
          </div>

          <div className="workflow mt-16">
            {/* 01 */}

            <div className="workflow-card">
              <span className="workflow-number">
                01
              </span>

              <div className="workflow-content">
                <div className="workflow-icon">
                  X
                </div>

                <h3>
                  Connect X
                </h3>

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

            {/* 02 */}

            <div className="workflow-card">
              <span className="workflow-number">
                02
              </span>

              <div className="workflow-content">
                <div className="workflow-icon score-icon">
                  +
                </div>

                <h3>
                  Get your Score
                </h3>

                <p>
                  Your activity becomes your HoodForge score.
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

            {/* 03 */}

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

                <h3>
                  Build your Network
                </h3>

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

            {/* 04 */}

            <div className="workflow-card">
              <span className="workflow-number">
                04
              </span>

              <div className="workflow-content">
                <div className="workflow-icon reward-icon">
                  $
                </div>

                <h3>
                  Unlock Rewards
                </h3>

                <p>
                  Your score and network can unlock higher rewards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SCORE SECTION
      ===================================================== */}

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
              HoodForge turns meaningful activity around your X account into
              a simple score you can understand and track.
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
                  <span>
                    {metric.name}
                  </span>

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

      {/* =====================================================
          REWARDS SECTION
      ===================================================== */}

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
                Your HoodForge score can determine your position within the
                reward range. Higher scores can unlock higher potential
                rewards.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="reward-pill">
                  <span>
                    Potential range
                  </span>

                  <strong>
                    $50 — $200
                  </strong>
                </div>

                <div className="reward-pill">
                  <span>
                    Current example
                  </span>

                  <strong>
                    842 → $176
                  </strong>
                </div>
              </div>

              <p className="mt-6 text-xs leading-6 text-white/25">
                Rewards shown are potential rewards and may be subject to
                eligibility requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

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