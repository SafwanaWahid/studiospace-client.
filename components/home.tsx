"use client";

import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Navigation,
  Pagination,
  A11y,
  Keyboard,
  EffectFade,
} from "swiper/modules";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Camera,
  Film,
  Mic,
  Music2,
  Paintbrush,
  Search,
  MapPin,
  Plus,
  Check,
  Info,
} from "lucide-react";
import { Button } from "./ui/button";
import { StudioCard, Skeleton, ErrorState, Empty, useResource } from "./shared";
import { type Studio, categories } from "@/lib/types";

const slides = [
  {
    image: "/media/photo-studio.jpg",
    alt: "Photographer and model reviewing a shot beside professional studio lights",
    category: "Photography",
    note: "Light, space, and a fresh perspective.",
  },
  {
    image: "/media/film-stage.jpg",
    alt: "Camera crew and lighting rig working on a studio film production",
    category: "Film & production",
    note: "From the first setup to the final take.",
  },
  {
    image: "/media/podcast-room.jpg",
    alt: "A microphone in a recording studio",
    category: "Podcasts & recording",
    note: "A room for conversations worth recording.",
  },
];
const categoryPhotos = [
  "photo-studio",
  "film-stage",
  "podcast-room",
  "music-suite",
  "workshop",
];
const categoryIcons = [Camera, Film, Mic, Music2, Paintbrush];

export function BookingSteps() {
  const steps = [
    [
      "Find your space.",
      "Browse by studio type, location, and hourly rate. Check the photos and what’s included.",
    ],
    [
      "Pick your hours.",
      "Choose a future start and end time. See the studio charge and deposit before requesting.",
    ],
    [
      "Send your request.",
      "Your host confirms the session. Follow its status from your bookings page.",
    ],
    [
      "Make good work.",
      "Arrive with your team and your ideas. Your studio details are all in one place.",
    ],
  ];
  return (
    <section className="container section workflow" id="how-it-works">
      <div className="section-heading">
        <div>
          <p className="eyebrow">FROM SEARCH TO SESSION</p>
          <h2>
            Less organising.
            <br />
            More creating.
          </h2>
        </div>
        <Link href="/how-it-works" className="text-link">
          How booking works <ArrowUpRight size={18} />
        </Link>
      </div>
      <div className="steps-grid">
        {steps.map(([title, text], index) => (
          <article className="step" key={title}>
            <div className="step-top">
              <span>0{index + 1}</span>
              <ArrowUpRight size={22} />
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { data, loading, error, reload } = useResource<Studio[]>(
    "/studios?featured=true",
  );
  const [slide, setSlide] = useState(1);
  const swiperRef = useRef<SwiperInstance | null>(null);
  useEffect(() => {
    const sync = () => {
      const swiper = swiperRef.current;
      if (!swiper || swiper.destroyed) return;
      const paused =
        document.documentElement.dataset.motion === "paused" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.visibilityState === "hidden";
      swiper.params.speed = paused ? 0 : 900;
      if (paused) swiper.autoplay.stop();
      else swiper.autoplay.start();
    };
    sync();
    window.addEventListener("studiospace:motion", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.removeEventListener("studiospace:motion", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return (
    <>
      <section className="landing-hero container">
        <div className="hero-editorial">
          <div className="hero-intro">
            <p className="eyebrow">
              <span className="status-dot" />
              FOR THE WORK YOU WANT TO MAKE
            </p>
            <h1>
              <span className="headline-mask">
                <span className="headline-line">Good work.</span>
              </span>
              <span className="headline-mask">
                <span className="headline-line">
                  Great{" "}
                  <span className="hero-word">
                    space
                    <svg viewBox="0 0 360 25" aria-hidden="true">
                      <path d="M4 15C74 2 217 3 350 12M27 23C128 11 236 12 325 20" />
                    </svg>
                    .
                  </span>
                </span>
              </span>
            </h1>
            <p className="hero-description">
              Photo shoots. Podcast sessions. First takes.
              <br className="desktop-break" /> Find your studio, book your
              hours, get to work.
            </p>
            <div className="hero-actions">
              <Button asChild>
                <Link href="/studios">
                  Explore studios <ArrowUpRight size={19} />
                </Link>
              </Button>
              <Link className="text-link" href="/add-studio">
                Have a space? List it <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="hero-footnote">
              <span>PHOTO</span>
              <span>FILM</span>
              <span>SOUND</span>
              <span>ART</span>
            </div>
          </div>
          <div className="hero-gallery">
            <div className="gallery-label">
              <span>
                <span className="status-dot" />A DIFFERENT KIND OF WORKSPACE
              </span>
              <span>STUDIO / 0{slide}</span>
            </div>
            <Swiper
              modules={[
                Autoplay,
                Navigation,
                Pagination,
                A11y,
                Keyboard,
                EffectFade,
              ]}
              effect="fade"
              a11y={{
                prevSlideMessage: "Previous studio photo",
                nextSlideMessage: "Next studio photo",
              }}
              fadeEffect={{ crossFade: true }}
              speed={900}
              keyboard={{ enabled: true }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                if (
                  document.documentElement.dataset.motion === "paused" ||
                  window.matchMedia("(prefers-reduced-motion: reduce)").matches
                )
                  swiper.autoplay.stop();
              }}
              navigation={{ prevEl: ".cover-prev", nextEl: ".cover-next" }}
              autoplay={{
                delay: 7000,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }}
              pagination={{ clickable: true }}
              onSlideChange={(swiper) => setSlide(swiper.realIndex + 1)}
              loop
              className="cover-swiper"
            >
              {slides.map((item, index) => (
                <SwiperSlide key={item.image}>
                  <div className="cover-frame">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 760px) 100vw, 55vw"
                      priority={index === 0}
                    />
                    <div className="cover-caption">
                      <span>{item.category}</span>
                      <p>{item.note}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="cover-controls">
              <span>ROOM TO DO YOUR THING.</span>
              <div>
                <button
                  className="cover-prev"
                  aria-label="Previous studio photo"
                >
                  <ArrowLeft size={19} />
                </button>
                <button className="cover-next" aria-label="Next studio photo">
                  <ArrowRight size={19} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <form className="home-search" action="/studios" method="get">
          <label>
            <span>WHAT ARE YOU MAKING?</span>
            <div>
              <Search size={18} />
              <select
                name="category"
                aria-label="Choose a studio category"
                defaultValue=""
              >
                <option value="">Find your kind of space</option>
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </label>
          <label>
            <span>WHERE DO YOU WANT TO CREATE?</span>
            <div>
              <MapPin size={18} />
              <input
                name="search"
                placeholder="City or neighbourhood"
                aria-label="City or neighbourhood"
              />
            </div>
          </label>
          <Button type="submit">
            Find a space <ArrowUpRight size={18} />
          </Button>
        </form>
      </section>
      <div
        className="studio-ticker"
        aria-label="Make something real. Find your focus. Room for your crew. Create on your terms."
      >
        <div className="ticker-track" aria-hidden="true">
          {[0, 1].map((copy) => (
            <div className="ticker-group" key={copy}>
              {[
                "MAKE SOMETHING REAL",
                "FIND YOUR FOCUS",
                "ROOM FOR YOUR CREW",
                "CREATE ON YOUR TERMS",
              ].map((label) => (
                <span className="ticker-item" key={label}>
                  <span>{label}</span>
                  <span className="ticker-star">✳</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <section className="container section featured-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE LATEST SPACES</p>
            <h2>
              Spaces worth
              <br />
              showing up for.
            </h2>
          </div>
          <div className="heading-aside">
            <p>
              Independent spaces. Clear hourly rates.
              <br />A setting for whatever comes next.
            </p>
            <Link href="/studios" className="text-link">
              View all studios <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
        {loading ? (
          <Skeleton cards={6} />
        ) : error ? (
          <ErrorState message={error} retry={reload} />
        ) : !data?.length ? (
          <Empty
            title="The collection starts with you."
            description="List a studio and give someone a place to make their next project."
            href="/add-studio"
            action="List your space"
          />
        ) : (
          <div className="studio-grid">
            {data.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}
      </section>
      <section className="category-section">
        <div className="container section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">FIVE WAYS TO MAKE IT HAPPEN</p>
              <h2>What’s your thing?</h2>
            </div>
            <p className="muted narrow">
              A quiet room to record. A set to shoot.
              <br />A table to cover in ideas.
            </p>
          </div>
          <div className="category-grid">
            {categories.map((category, index) => {
              const Icon = categoryIcons[index];
              return (
                <Link
                  className="category-card"
                  href={`/studios?category=${encodeURIComponent(category)}`}
                  key={category}
                >
                  <div className="category-photo">
                    <Image
                      src={`/media/${categoryPhotos[index]}.jpg`}
                      alt={`${category} creative workspace`}
                      fill
                      sizes="(max-width: 600px) 45vw, (max-width: 900px) 30vw, 20vw"
                    />
                    <span className="category-number">0{index + 1}</span>
                    <span className="category-arrow">
                      <ArrowUpRight size={21} />
                    </span>
                  </div>
                  <div className="category-title">
                    <Icon size={18} />
                    <h3>{category}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <BookingSteps />
      <section className="creator-section">
        <div className="container creator-grid">
          <div className="creator-visual">
            <Image
              src="/media/color-studio.jpg"
              alt="Lighting equipment arranged around a colourful studio production set"
              fill
              sizes="(max-width: 760px) 100vw, 50vw"
            />
            <span className="image-corner top-left" />
            <span className="image-corner bottom-right" />
            <div className="creator-stamp">
              LESS GUESSWORK.
              <br />
              BETTER SESSIONS.
            </div>
          </div>
          <div className="creator-copy">
            <p className="eyebrow">CLEAR EXPECTATIONS FOR EVERY SESSION</p>
            <h2>
              Know the space.
              <br />
              Meet the host.
              <br />
              <em>Make it yours.</em>
            </h2>
            <p>
              Good sessions start with clear expectations. Check what the
              platform and each host provide before you request a booking.
            </p>
            <div className="creator-checks">
              {[
                [
                  "Signed-in accounts",
                  "Sign-in is required for listing and booking actions. StudioSpace does not independently verify user identities.",
                ],
                [
                  "Equipment and access",
                  "Amenities are supplied by each host. Confirm equipment, safe handling, and access details before your session.",
                ],
                [
                  "Costs shown up front",
                  "Review the hourly rate and refundable security deposit before sending a booking request.",
                ],
                [
                  "Support and protection limits",
                  "Hosts manage booking requests. StudioSpace does not provide liability insurance or staffed 24/7 support.",
                ],
              ].map(([title, text], index) => (
                <div key={title}>
                  {index === 3 ? <Info size={17} /> : <Check size={17} />}
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="container section faq-section">
        <div>
          <p className="eyebrow">A FEW THINGS TO KNOW</p>
          <h2>
            Before you
            <br />
            make a move.
          </h2>
          <Link href="/how-it-works" className="text-link">
            More about booking <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="faq-list">
          {[
            [
              "How does a studio booking work?",
              "Pick a studio and request a future time slot. Your reservation starts as Pending. The host reviews the request and confirms the hours from their Dashboard.",
            ],
            [
              "What’s included in the price?",
              "Each listing shows its hourly rate and security deposit. The booking form calculates an estimate from your chosen hours. Check the studio’s amenities for included equipment.",
            ],
            [
              "Can I cancel a request?",
              "Yes. Cancel a Pending reservation from My Bookings. Once the host confirms, this assignment’s booking flow does not offer cancellation.",
            ],
            [
              "Can I list my own studio?",
              "Yes. Create an account, open Add New Studio, and enter photos, rates, location, amenities, and a detailed description. Manage your listing and requests from your profile menu.",
            ],
          ].map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <Plus size={18} />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="container host-cta">
        <div className="host-cta-copy">
          <p className="eyebrow">FOR THE PEOPLE WITH THE KEYS</p>
          <h2>
            Your space.
            <br />
            Their next great project.
          </h2>
          <p>
            Put your studio’s free hours to work.
            <br />
            Set your rate. Meet your next creator.
          </p>
          <Button asChild>
            <Link href="/add-studio">
              List your studio <ArrowUpRight size={19} />
            </Link>
          </Button>
        </div>
        <div className="host-cta-art">
          <Image
            src="/media/music-suite.jpg"
            alt="Recording equipment and mixing console inside a music studio"
            fill
            sizes="(max-width: 600px) 100vw, 40vw"
          />
          <div className="host-sticker">
            <span>
              OPEN
              <br />
              FOR IDEAS.
            </span>
            <ArrowUpRight size={38} />
          </div>
        </div>
      </section>
    </>
  );
}
